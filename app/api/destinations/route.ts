import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
    const refreshedToken = req.headers.get('x-refreshed-access-token')
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


    if (refreshedToken && token) {
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const formData = await req.formData();

    const createDestinationSchema = z.object({
        name: z.string().min(1, "name is required"),
        image: z.instanceof(File)
            .refine(file => file.size > 0, { message: "file is required" })
            .refine(file => ['image/png', 'image/jpeg'].includes(file.type), { message: "only jpeg and png formats supported" })
            .refine(file => file.size <= 5 * 1024 * 1024, { message: "max supported file size is 5MB" }),
    });

    const parsedData = createDestinationSchema.safeParse({
        name: formData.get('name'),
        image: formData.get('image')
    });

    if (!parsedData.success) {
        return NextResponse.json({
            success: false, error: parsedData.error.message || "validation failed"
        }, { status: 400 })
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API}/destinations`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.access_token}`
            },
            body: formData,
        })

        if (!res.ok) {
            return NextResponse.json({
                success: false, error: res.text || 'Backend request failed'
            }, { status: res.status })
        }

        const data = await res.json();

        return NextResponse.json({
            success: true, data
        }, { status: res.status });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ?
                error.message :
                String(error)
        }, { status: 500 });
    }
}

