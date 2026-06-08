import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import z from "zod";

// getTestimonials() GET /testimonials
// createTestimonial(testimonialImage, name, content, country) POST /testimonials
// getTestimonial(testimonialId) GET /testimonials/testimonialId
// updateTestimonial(testimonialId, testimonialImage, name, content, country) PATCH /testimonials/testimonialId
// deleteTestimonial(testimonialId) DELETE /testimonials/testimonialId

export async function getTestimonials() {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/testimonials`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function createTestimonial(formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createTestimonialSchema = z.object({
        image: z.instanceof(File)
            .refine(file => ['image/png', 'image/jpeg'].includes(file.type), {
                message: "Supported image types are JPEG & PNG only"
            })
            .refine(file => file.size <= 5 * 1024 * 1024, {
                message: "Max supported file size is 5MB"
            }),
        name: z.string().min(1, "Name is required"),
        content: z.string().min(1, "Content is required"),
        country: z.string().min(1, 'Country is required'),
    });

    const parsedData = createTestimonialSchema.safeParse({
        name: formData.get('name'),
        content: formData.get('content'),
        image: formData.get('image'),
        country: formData.get('country')
    });

    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/testimonials`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function getTestimonial(testimonialId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/testimonials/${testimonialId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function updateTestimonial(testimonialId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createTestimonialSchema = z.object({
        testimonialImage: z.instanceof(File)
            .optional()
            .refine(file => !file || ['image/png', 'image/jpeg'].includes(file.type), {
                message: "Supported image types are JPEG & PNG only"
            })
            .refine(file => !file || file.size <= 5 * 1024 * 1024, {
                message: "Max supported file size is 5MB"
            }),
        name: z.string().optional(),
        content: z.string().optional(),
        country: z.string().optional(),
    });

    const rawImage = formData.get('image') as File || undefined;
    const image = rawImage && rawImage.size > 0 ? rawImage : undefined;

    const parsedData = createTestimonialSchema.safeParse({
        name: formData.get('name'),
        content: formData.get('content'),
        image,
        country: formData.get('country')
    });

    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/testimonials/${testimonialId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function deleteTestimonial(testimonialId: string) { 
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/testimonials/${testimonialId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}