'use server'

import z from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function createDestination(formData: FormData) { 
    const session = await getServerSession(authOptions);
    const { accessToken } = session!; 

    const createDestinationSchema = z.object({
        name: z.string().min(1, 'Name is required'),
        image: z.instanceof(File, {message: "Image should be a file"})
        .refine(file => file.size > 0, {message: "Image is required"})
        .refine(file => ['image/png', 'image/jpeg'].includes(file.type), {message: "Supported image types are PNG and JPEG only"})
        .refine(file => file.size <= 5 * 1024 * 1024, {message: "Max allowed image size is 5MB"})
    });

    const parsedData = createDestinationSchema.safeParse({
        name: formData.get('name'),
        image: formData.get('image')
    });

    if(!parsedData.success){
        return {success: false, error: parsedData.error.message || 'Data validation error'}
    }

    try{
        const res = await fetch(`${process.env.BACKEND_API}/tours/destinations`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        });

        if(!res.ok){
            const errorMessage = await res.json();
            return {success: false, errorMessage};
        }

        const data = await res.json();

        return {success: true, data}
    } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : String(error)};
    }
}

export async function deleteDestination(destinationId: string) { 
    const session = await getServerSession(authOptions);
    const { accessToken } = session!; 

    try{
        const res = await fetch(`${process.env.BACKEND_API}/tours/destinations/${destinationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(!res.ok){
            const errorMessage = await res.json();
            return {success: false, errorMessage};
        }

        const data = await res.json();

        return {success: true, data}
    } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : String(error)};
    }
}

export async function updateDestination(destinationId: string, formData: FormData) { 
    const session = await getServerSession(authOptions);
    const { accessToken } = session!; 

    const updateDestinationSchema = z.object({
        name: z.string().optional(),
        image: z.instanceof(File)
        .optional()
        .refine(file => !file || ['image/png', 'image/jpeg'].includes(file.type), {message: "Supported image types are PNG and JPEG only"})
        .refine(file => !file || file.size <= 5 * 1024 * 1024, {message: "Max allowed image size is 5MB"})
    });

    const rawImage = formData.get('image') as File || null;
    const image = rawImage && rawImage.size > 0 ? rawImage : null;

    const parsedData = updateDestinationSchema.safeParse({
        name: formData.get('name'),
        image
    });

    if(!parsedData.success){
        return {success: false, error: parsedData.error.message || 'Data validation error'}
    }

    try{
        const res = await fetch(`${process.env.BACKEND_API}/tours/destinations`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        });

        if(!res.ok){
            const errorMessage = await res.json();
            return {success: false, errorMessage};
        }

        const data = await res.json();

        return {success: true, data}
    } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : String(error)};
    }
}