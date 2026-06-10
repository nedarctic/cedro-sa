import { getToken } from "next-auth/jwt";
import z from "zod";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ teamMemberId: string }> }) {
    const { teamMemberId } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const refreshedToken = req.headers.get('x-refreshed-access-token');
    if (token && refreshedToken) {
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const updateTeamMemberSchema = z.object({
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        designation: z.string().min(1).optional(),
        image: z
            .instanceof(File)
            .optional()
            .refine(file => !file || file.size > 0, { message: "file should be greater than 0" })
            .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
                message: "Max file size is 5MB",
            })
            .refine((file) => !file || ["image/jpeg", "image/png"].includes(file.type), {
                message: "Only JPEG and PNG files are allowed",
            }),
    });

    const parsedData = updateTeamMemberSchema.safeParse({
        name: formData.get("name") || undefined,
        description: formData.get("description") || undefined,
        designation: formData.get("designation") || undefined,
        image: formData.get("image") ?? undefined,
    });

    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    try {
        let res = await fetch(`${process.env.BACKEND_API}/team/${teamMemberId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            return NextResponse.json({ success: false, error: "Failed to add team member" }, { status: 400 });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, data });

    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}

export async function DELETE (req: NextRequest, { params }: { params: Promise<{ teamMemberId: string }> }) {
    const { teamMemberId } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const refreshedToken = req.headers.get('x-refreshed-access-token');
    if (token && refreshedToken) {
        token.access_token = refreshedToken;
    }

    if (!token?.access_token) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let res = await fetch(`${process.env.BACKEND_API}/team/${teamMemberId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json({ success: false, error: "Failed to delete team member" }, { status: 400 });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, data });

    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}