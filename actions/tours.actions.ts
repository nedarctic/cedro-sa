'use server'

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import z from 'zod';
import { refreshToken } from "./auth.actions";

const createTourSchema = z.object({
    dates: z.string().min(1, "Dates are required"),
    duration: z.string().min(1, "Duration is required"),

    groupSize: z.string(),

    price: z.string().min(1, 'Price is needed'),

    title: z.string().min(1, "Title is required"),
    intro: z.string().min(1, "Introduction is required"),

    image: z.instanceof(File).refine(
        (file) => file.type.startsWith("image/"),
        "Tour image must be an image file"
    ),

    included: z.array(z.string()).default([]),
    excluded: z.array(z.string()).default([]),
    activities: z.array(z.string()).default([]),
});

export async function createTour(formData: FormData) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

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

    const sendRequest = async (token: string) => {
        return await fetch(`${process.env.BACKEND_API}/tours`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
    }

    try {
        let response = await sendRequest(access_token!);

        if (response.status === 401  || response.status === 403) {

            const refreshResponse = await refreshToken();

            if(!refreshResponse.ok){
                const errorMessage = await refreshResponse.json();
                return {success: false, error: errorMessage}
            }

            const {access_token} = await refreshResponse.json();

            response = await sendRequest(access_token);
        }

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
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

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

    const sendRequest = async (token: string) => {
        return await fetch(`${process.env.BACKEND_API}/tours/${tourId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
    };

    try {
        let response = await sendRequest(access_token!);

        if (response.status === 401 || response.status === 403) {
            const refreshResponse = await refreshToken()

            if (!refreshResponse.ok) {
                const errorMessage = await refreshResponse.json();
                return { success: false, error: errorMessage }
            }

            const {access_token} = await refreshResponse.json();

            response = await sendRequest(access_token);
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `Failed to update tour: ${errorData.message || response.statusText}`
            );
        }

        revalidatePath(`tours/${tourId}`);

        return { success: true, data: await response.json() };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

export async function deleteTour(tourId: string) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

    const sendRequest = async (token: string) => {
        return await fetch(`${process.env.BACKEND_API}/tours/${tourId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    try {
        let response = await sendRequest(access_token!);

        if (response.status === 401 || response.status === 403) {

            const refreshResponse = await refreshToken();

            if (!refreshResponse.ok) {
                const errorMessage = await refreshResponse.json();
                return { success: false, error: errorMessage }
            }

            const { access_token } = await refreshResponse.json();

            response = await sendRequest(access_token);
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to delete tour: ${errorData.message || response.statusText}`);
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function getTour(tourId: string) {

    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

    const sendRequest = async (token: string) => {
        return await fetch(`${process.env.BACKEND_API}/tours/${tourId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    try {
        let response = await sendRequest(access_token!);

        if (response.status === 401 && refresh_token) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: await refreshRes.json() }
            }

            const { access_token } = await refreshRes.json();

            response = await sendRequest(access_token);
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch tour: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }

}

export async function getTours() {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

    const sendRequest = async (token: string) => {
        return await fetch(`${process.env.BACKEND_API}/tours`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    try {
        let res = await sendRequest(access_token!);

        if (res.status === 401 || res.status === 403) {
            const refreshResponse = await refreshToken();

            if (!refreshResponse.ok) {
                return { success: false, error: "Session expired. Please log in." }
            }

            const { access_token } = await refreshResponse.json();

            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`Failed to fetch tours: ${errorData.message || res.statusText}`);
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}