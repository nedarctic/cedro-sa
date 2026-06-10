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

    const addTeamMemberSchema = z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        designation: z.string().min(1),
        image: z.instanceof(File)
            .refine(file => file.size > 0, { message: "image file required" })
            .refine(file => file.size >= 5 * 1024 * 1024, { message: "max supported file size is 5MB" })
            .refine(file => ['image/png', 'image/jpeg'].includes(file.type), { message: "Supported formats are PNG and JPEG only" }),
    });

    const parsedData = addTeamMemberSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        designation: formData.get('designation'),
        image: formData.get('image'),
    });

    if (!parsedData.success) {
        return NextResponse.json({ success: false, error: parsedData.error.message });
    }

    try {
        let res = await fetch(`${process.env.BACKEND_API}/team`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            return NextResponse.json({ success: false, error: "Failed to create team member" }, { status: 400 });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, data });

    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
}