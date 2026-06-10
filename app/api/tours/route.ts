import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const refreshedToken = req.headers.get('x-refreshed-access-token');

    if (token && refreshedToken) {
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const createTourSchema = z.object({
        dates: z.string().min(1, "Dates are required"),
        duration: z.string().min(1, "Duration is required"),
        groupSize: z.string().min(1, "Group size required"),
        price: z.string().min(1, 'Price is needed'),
        title: z.string().min(1, "Title is required"),
        intro: z.string().min(1, "Introduction is required"),
        image: z.instanceof(File)
            .refine(file => file.size > 0, { message: "File required" })
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

    const parsedData = createTourSchema.safeParse({
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
        let res = await fetch(`${process.env.BACKEND_API}/tours`, {
            method: "POST",
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