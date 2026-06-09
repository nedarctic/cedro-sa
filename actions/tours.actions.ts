'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import z from 'zod';

const createTourSchema = z.object({
    dates: z.string().min(1, "Dates are required"),
    duration: z.string().min(1, "Duration is required"),

    groupSize: z.string(),

    price: z.string().min(1, 'Price is needed'),

    title: z.string().min(1, "Title is required"),
    intro: z.string().min(1, "Introduction is required"),

    image: z.instanceof(File)
    .refine(file => ['image/png', 'image/jpeg'].includes(file.type), {
        message: "Supported image types are PNG and JPEG"
    })
    .refine(file => file.size <= 5 * 1024 * 1024, {
        message: "Max supported image size is 5MB"
    }),

    included: z.array(z.string()).default([]),
    excluded: z.array(z.string()).default([]),
    activities: z.array(z.string()).default([]),
});

export async function createTour(formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const image = formData.get("image") as File;

    const parsedData = createTourSchema.safeParse({
        dates: formData.get("dates"),
        duration: formData.get("duration"),
        groupSize: formData.get("groupSize"),
        price: formData.get("price"),
        title: formData.get("title"),
        intro: formData.get("intro"),

        image,

        included: formData.getAll("included"),
        excluded: formData.getAll("excluded"),
        activities: formData.getAll("activities"),
    });

    if (!parsedData.success) {
        throw new Error(`Validation failed: ${parsedData.error.message}`);
    }

    try {
        let response = await fetch(`${process.env.BACKEND_API}/tours`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to create tour: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function updateTour(tourId: string, formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const updateTourSchema = z.object({
        title: z.string().min(1).optional(),
        dates: z.string().min(1).optional(),
        duration: z.string().min(1).optional(),
        groupSize: z.string().min(1).optional(),
        price: z.string().min(1).optional(),
        intro: z.string().min(1).optional(),
        image: z
            .instanceof(File)
            .optional()
            .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
                message: "Max file size is 5MB",
            })
            .refine((file) => !file || ["image/jpeg", "image/png"].includes(file.type), {
                message: "Only JPEG and PNG files are allowed",
            }),
        included: z.array(z.string()).optional(),
        excluded: z.array(z.string()).optional(),
        activities: z.array(z.string()).optional(),
    });

    const rawImage = formData.get('image');

    const image = rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;

    const parsedData = updateTourSchema.safeParse({
        title: formData.get('title'),
        dates: formData.get('dates'),
        duration: formData.get('duration'),
        groupSize: formData.get('groupSize'),
        price: formData.get('price'),
        intro: formData.get('intro'),
        image,
        included: formData.getAll('included'),
        excluded: formData.getAll('excluded'),
        activities: formData.getAll('activities'),
    });

    if (parsedData.error) {
        const errorMessage = parsedData.error.message;
        console.error('Validation error:', errorMessage);
        return { success: false, error: errorMessage }
    }

    try {
        let response = await fetch(`${process.env.BACKEND_API}/tours/${tourId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `Failed to update tour: ${errorData.message || response.statusText}`
            );
        }

        revalidatePath(`tours/${tourId}`);

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

export async function deleteTour(tourId: string) {

    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        let response = await fetch(`${process.env.BACKEND_API}/tours/${tourId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to delete tour: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}
