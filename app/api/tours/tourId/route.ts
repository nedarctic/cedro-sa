import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tourId: string }> }) {

    const { tourId } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const refreshedToken = req.headers.get('x-refreshed-access-token');

    if (token && refreshedToken) {
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const updateTourSchema = z.object({
        dates: z.string().min(1, "Dates are required").optional(),
        duration: z.string().min(1, "Duration is required").optional(),
        groupSize: z.string().min(1, 'Group size is required').optional(),
        price: z.string().min(1, 'Price is needed').optional(),
        title: z.string().min(1, "Title is required").optional(),
        intro: z.string().min(1, "Introduction is required").optional(),
        image: z.instanceof(File)
            .optional()
            .refine(file => !file || file.size > 0, { message: "File required" })
            .refine(file => !file || ['image/png', 'image/jpeg'].includes(file.type), {
                message: "Supported image types are PNG and JPEG"
            })
            .refine(file => !file || file.size <= 5 * 1024 * 1024, {
                message: "Max supported image size is 5MB"
            }),
        included: z.array(z.string()).default([]).optional(),
        excluded: z.array(z.string()).default([]).optional(),
        activities: z.array(z.string()).default([]).optional(),
    });

    const parsedData = updateTourSchema.safeParse({
        dates: formData.get("dates"),
        duration: formData.get("duration"),
        groupSize: formData.get("groupSize"),
        price: formData.get("price"),
        title: formData.get("title"),
        intro: formData.get("intro"),
        image: formData.get('image'),
        included: formData.getAll("included"),
        excluded: formData.getAll("excluded"),
        activities: formData.getAll("activities"),
    });

    if (!parsedData.success) {
        throw new Error(`Validation failed: ${parsedData.error.message}`);
    }

    try {
        let res = await fetch(`${process.env.BACKEND_API}/tours/${tourId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            return NextResponse.json({ success: false, error: "Failed to create tour" }, { status: 400 });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, data });

    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
}

export async function DELETE (req: NextRequest, {params}: {params: Promise<{tourId: string}>}) {
    const { tourId } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const refreshedToken = req.headers.get('x-refreshed-access-token');

    if (token && refreshedToken) {
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        let response = await fetch(`${process.env.BACKEND_API}/tours/${tourId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, error: "Failed to delete tour" }, { status: 400 });
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
}