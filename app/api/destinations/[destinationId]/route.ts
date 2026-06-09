import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ destinationId: string }> }) {

    const { destinationId } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const refreshedToken = req.headers.get('x-refreshed-access_token');

    if (token && refreshedToken) {
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json({
            success: false,
            error: 'Unauthorized'
        }, { status: 401 })
    }

    const formData = await req.formData();

    const updateDestinationSchema = z.object({
        name: z.string().min(1, 'name is required').optional(),
        image: z.instanceof(File)
            .optional()
            .refine(file => !file || file.size > 0, { message: "file is required" })
            .refine(file => !file || ['image/png', 'image/jpeg'].includes(file.type), { message: "only jpeg and png formats supported" })
            .refine(file => !file || file.size <= 5 * 1024 * 1024, { message: "max supported file size is 5MB" }),
    });

    const parsedData = updateDestinationSchema.safeParse({
        name: formData.get('name'),
        image: formData.get('image'),
    });

    if (!parsedData.success) {
        return NextResponse.json({ success: false, error: parsedData.error.message || 'validation error' }, { status: 400 })
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API}/destinations/${destinationId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        if (!res.ok) {
            return NextResponse.json({
                success: false, error: res.text || 'Backend request failed'
            });
        }

        const data = await res.json();

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ?
                error.message :
                String(error)
        })
    }
}