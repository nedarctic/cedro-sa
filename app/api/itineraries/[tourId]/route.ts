import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { revalidatePath } from "next/cache";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ tourId: string }> }
) {
    const refreshedToken = req.headers.get('x-refreshed-access-token');
    let token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log('Token:', token);

    if (refreshedToken && token) {
        // Override the token with the fresh one from middleware
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { tourId } = await params;

    const formData = await req.formData();

    const createItinerarySchema = z.object({
        day: z.string().min(1, "day is required"),
        title: z.string().min(1, "title is required"),
        activities: z.array(z.string()),
        dayImage: z
            .instanceof(File)
            .refine((file) =>
                ["image/png", "image/jpeg"].includes(file.type),
                { message: "Only PNG and JPEG images are allowed" }
            )
            .refine((file) => file.size <= 5 * 1024 * 1024, {
                message: "Max image size allowed is 5MB",
            }),
    });

    const rawImage = formData.get("dayImage");
    const dayImage =
        rawImage instanceof File && rawImage.size > 0
            ? rawImage
            : undefined;

    const parsedData = createItinerarySchema.safeParse({
        day: formData.get("day"),
        title: formData.get("title"),
        activities: formData.getAll("activities"),
        dayImage,
    });

    if (!parsedData.success) {
        return NextResponse.json(
            {
                success: false,
                error: parsedData.error.message,
            },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `${process.env.BACKEND_API}/itineraries/${tourId}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
                body: formData,
            }
        );

        if (!res.ok) {
            const errText = await res.text();
            return NextResponse.json(
                {
                    success: false,
                    error: errText || "Backend request failed",
                },
                { status: res.status }
            );
        }

        const data = await res.json();

        revalidatePath(
            `/tours/${tourId}/create-edit-itinerary`
        );

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            { status: 500 }
        );
    }
}