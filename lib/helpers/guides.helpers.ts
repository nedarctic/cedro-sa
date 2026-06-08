import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import z from "zod";

// getDestinationGuides(destinationId) GET tours/destinations/destinationId/guides
// getDestinationGuide(destinationId, guideId) GET tours/destinations/destinationId/guides/guideId
// createDestinationGuide(destinationId, subtitle, content) POST tours/destinations/destinationId/guides
// updateDestinationGuide(destinationId, guideId, subtitle?, content?) PATCH tours/destinations/destinationId/guides/guideId
// deleteDestinationGuide(destinationId, guideId) DELETE destinations/destinationId/guide/guideId

export async function getDestinationGuides(destinationId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_API}/tours/destinations/${destinationId}/guides`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, errorMessage };
        }

        const data = await res.json();

        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function getDestinationGuide(destinationId: string, guideId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_API}/tours/destinations/${destinationId}/guides/${guideId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, errorMessage };
        }

        const data = await res.json();

        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function createDestinationGuide(destinationId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createDestinationGuideSchema = z.object({
        subtitle: z.string().min(1, 'Subtitle required'),
        content: z.string().min(1, 'Content is required')
    })

    const parsedData = createDestinationGuideSchema.safeParse({
        subtitle: formData.get('subtitle'),
        content: formData.get('content')
    });

    if(!parsedData.success){
        return {success: false, error: parsedData.error.message};
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API}/tours/destinations/${destinationId}/guides`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
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

export async function updateDestinationGuide(destinationId: string, guideId: string, formData: FormData){
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createDestinationGuideSchema = z.object({
        subtitle: z.string().optional(),
        content: z.string().optional(),
    })

    const parsedData = createDestinationGuideSchema.safeParse({
        subtitle: formData.get('subtitle'),
        content: formData.get('content')
    });

    if(!parsedData.success){
        return {success: false, error: parsedData.error.message};
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API}/tours/destinations/${destinationId}/guides/${guideId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
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

export async function deleteDestinationGuide(destinationId: string, guideId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_API}/destinations/${destinationId}/guide/${guideId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, errorMessage };
        }

        const data = await res.json();

        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}