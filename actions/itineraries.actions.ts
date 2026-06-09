'use server'

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export async function createItinerary(tourId: string, formData: FormData) {

    const session = await getServerSession(authOptions);
    const {accessToken} = session!;

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
        return { success: false, error: validationErrorMessage }
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
            return { success: false, error: "Something went wrong." }
        }

        const data = await res.json();

        revalidatePath(`/tours/${tourId}/create-edit-itinerary`)

        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }
}

export async function deleteItinerary(itineraryId: string) {
    const session = await getServerSession(authOptions);
    const {accessToken} = session!;

    try {
        let res = await fetch(`${process.env.BACKEND_API}/itineraries/${itineraryId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage || res.text }
        }

        const data = await res.json();

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }
}

export async function updateItinerary(tourId: string, itineraryId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const {accessToken} = session!;

    const updateItinerarySchema = z.object({
        day: z.string().min(1, 'day required').optional(),
        title: z.string().min(1, 'title required').optional(),
        activities: z.array(z.string()).optional(),
        dayImage: z.instanceof(File).optional()
            .refine(file => !file || ['image/png', 'image/jpeg'].includes(file.type), { message: "Only JPEG and PNG files allowed." })
            .refine(file => !file || file.size <= 5 * 1024 * 1024, { message: "Max image size is 5MB" })
    });

    const rawImage = formData.get('image');
    const dayImage = rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;

    const parsedData = updateItinerarySchema.safeParse({
        day: formData.get('day'),
        title: formData.get('title'),
        activities: formData.getAll('activities'),
        dayImage
    });

    if (!parsedData.success) {
        const validationErrorMessage = parsedData.error.message;
        console.log('Error parsing itinerary update data:', validationErrorMessage);
        return { success: false, error: validationErrorMessage }
    }

    try {
        let res = await fetch(`${process.env.BACKEND_API}/itineraries/${itineraryId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData,
        });

        if (!res.ok) {
            return { success: false, error: "Something went wrong" };
        }

        revalidatePath(`/tours/${tourId}/create-edit-itinerary`);
        const data = await res.json();

        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }
}