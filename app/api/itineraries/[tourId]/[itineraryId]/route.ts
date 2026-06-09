import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tourId: string; itineraryId: string }> }) {
    const { tourId, itineraryId } = await params;

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const refreshedToken = req.headers.get('x-refreshed-access-token');

    if (token && refreshedToken) {
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json({
            success: false,
            error: 'Unauthorized'
        }, { status: 401 });
    }

    const formData = await req.formData();

    const updateItinerarySchema = z.object({
        day: z.string().min(1, "day is required").optional(),
        title: z.string().min(1, "title is required").optional(),
        activities: z.array(z.string()).optional(),
        dayImage: z
            .instanceof(File)
            .optional()
            .refine(file => !file || file.size > 0, {message: 'file should be greater than 0MB'})
            .refine((file) =>
                !file || ["image/png", "image/jpeg"].includes(file.type),
                { message: "Only PNG and JPEG images are allowed" }
            )
            .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
                message: "Max image size allowed is 5MB",
            }),
    });

    const parsedData = updateItinerarySchema.safeParse({
        day: formData.get('day'),
        title: formData.get('title'),
        activities: formData.getAll('activities'),
        dayImage: formData.get('image')
    });

    if(!parsedData.success){
        return NextResponse.json({
            success: false,
            error: parsedData.error.message || 'validation error'
        })
    }

    try {

    } catch (error) {}
}