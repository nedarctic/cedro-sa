import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


export async function POST( req: NextRequest ) {
    const refreshedToken = req.headers.get('x-refreshed-access-token');
    let token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log('Token:', token);

    if (refreshedToken && token) {
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    const formData = await req.formData();

    const createBlogSchema = z.object({
        title: z.string().min(1, "Title is required"),
        date: z.string(),
        excerpt: z.string().max(200, "Excerpt must be less than 200 characters"),
        image: z.instanceof(File)
            .refine(file => file.size > 0, { message: "file required" })
            .refine(file => file.size <= 5 * 1024 * 1024, { message: "max file size is 5MB" })
            .refine(file => ['image/png', 'image/jpeg'].includes(file.type), { message: "file type should be image" }),
    });

    const parsedData = createBlogSchema.safeParse({
        title: formData.get("title") as string,
        date: formData.get("date") as string,
        excerpt: formData.get("excerpt") as string,
        image: formData.get("image") as File,
    });

    if (!parsedData.success) {
        return NextResponse.json(
            {
                success: false,
                error: parsedData.error.message,
            },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `${process.env.BACKEND_API}/blogs`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
                body: formData,
            }
        );

        if (!res.ok) {
            const errText = await res.text();
            return NextResponse.json(
                {
                    success: false,
                    error: errText || "Backend request failed",
                },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            { status: 500 }
        );
    }
}