import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import z from "zod";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest, { params }: { params: Promise<{ tourId: string }> }) {

    const { tourId } = await params;
    console.log('Tour ID:', tourId)

    const formData = await req.formData();

    console.log('Form data at the route handler:', formData);

    console.log('Day:', formData.get('day'))
    console.log('Title:', formData.get('title'))
    console.log('Activities:', formData.getAll('activities'));

    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    console.log('Access token at the create itinerary route:', accessToken);

    const createItinerarySchema = z.object({
        day: z.string().min(1, "day is required"),
        title: z.string().min(1, "title is required"),
        activities: z.array(z.string()),
        dayImage: z
            .instanceof(File, { message: "Image should be a file." })
            .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), { message: "Only PNG and JPEG images are allowed" })
            .refine((file) => file.size <= 5 * 1024 * 1024, { message: "Max image size allowed is 5MB" })
    });


    const rawImage = formData.get('dayImage');
    const dayImage = rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;

    const parsedData = createItinerarySchema.safeParse({
        day: formData.get('day'),
        title: formData.get('title'),
        activities: formData.getAll('activities'),
        dayImage
    });

    if (!parsedData.success) {
        const validationErrorMessage = parsedData.error.message;
        return NextResponse.json({ success: false, error: validationErrorMessage })
    }

    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/itineraries/${tourId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            body: formData,
        });
    }

    try {
        let res = await sendRequest(accessToken!);

        if (!res.ok) {
            return NextResponse.json({ success: false, error: "Something went wrong." })
        }

        const data = await res.json();

        revalidatePath(`/tours/${tourId}/create-edit-itinerary`)

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "An unknown error occurred." });
    }
}