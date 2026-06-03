'use server'

import z from 'zod';
import { cookies } from 'next/headers';
import { refreshToken } from './auth.actions';
import { revalidatePath } from 'next/cache';

export async function getItinerary(tourId: string) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;

    // @Get('tour/:tourId')
    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/itineraries/tour/${tourId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
    }

    try {
        let res = await sendRequest(access_token!);

        if (res.status === 401  || res.status === 403) {
            let refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please log in again." }
            }

            const { access_token } = await refreshRes.json();

            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Something went wrong." }
        }

        const data = await res.json();

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }
}

export async function createItinerary(tourId: string, formData: FormData) {

    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;

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

    /*

    @Post()
    @UseInterceptors(FileInterceptor('dayImage'))
    async createItinerary(
        @Body() createItineraryDto: { tourId: string; day: string; title: string; activities: string[] },
        @UploadedFile() dayImage: Express.Multer.File
    ) {
        const { tourId, day, title, activities } = createItineraryDto;
        return this.itinerariesService.createItinerary(tourId, day, title, activities, dayImage);
    }

    */

    try {
        let res = await sendRequest(access_token!);

        if (res.status === 401  || res.status === 403) {
            let refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please log in again." }
            }

            const { access_token } = await refreshRes.json();

            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Something went wrong." }
        }

        revalidatePath(`/tours/${tourId}/create-edit-itinerary`)

        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }
}

export async function deleteItinerary(itineraryId: string) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;

    console.log('Itinerary ID provided:', itineraryId)

    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/itineraries/${itineraryId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
    }

    try {
        let res = await sendRequest(access_token!);

        if (res.status === 401  || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." }
            }

            const { access_token } = await refreshRes.json();

            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage || res.text }
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }
}

export async function updateItinerary(tourId: string, itineraryId: string, formData: FormData) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;

    const updateItinerarySchema = z.object({
        day: z.string().optional(),
        title: z.string().optional(),
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
    /*
    
    @Patch(':id')
    @UseInterceptors(FileInterceptor('dayImage'))
    async updateItinerary(
        @Param('id') id: string,
        @Body() updateItineraryDto: { day: string; title: string; activities: string[] },
        @UploadedFile() dayImage?: Express.Multer.File
    ) {
        const { day, title, activities } = updateItineraryDto;
        return this.itinerariesService.updateItinerary(id, day, title, activities, dayImage);
    }

    */
    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/itineraries/${itineraryId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            body: formData,
        })
    }

    try {
        let res = await sendRequest(access_token!);

        if (res.status === 401  || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please log in again." }
            }

            const { access_token } = await refreshRes.json();

            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Something went wrong" };
        }

        revalidatePath(`/tours/${tourId}/create-edit-itinerary`)
        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }
}