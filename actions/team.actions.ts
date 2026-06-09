'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import z from 'zod'

export type TeamMemberOperationStatus = {
    success: boolean;
    error?: string;
    data?: any
}

export async function addTeamMember(formData: FormData): Promise<TeamMemberOperationStatus> {
    const session = await getServerSession(authOptions);
    const {accessToken} = session!;

    const addTeamMemberSchema = z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        designation: z.string().min(1),
        image: z.instanceof(File),
    });

    const parsedData = addTeamMemberSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        designation: formData.get('designation'),
        image: formData.get('image'),
    });

    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    try {
        let res = await fetch(`${process.env.BACKEND_API}/team`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!res.ok) {
            return { success: false, error: "Failed to create team member" };
        }

        revalidatePath('/team');

        const data = await res.json();
        return { success: true, data };

    } catch (err) {
        return { success: false, error: "An unknown error occurred." };
    }
}

export async function removeTeamMember(memberId: string): Promise<TeamMemberOperationStatus> {
    const session = await getServerSession(authOptions);
    const {accessToken} = session!;

    try {
        let res = await fetch(`${process.env.BACKEND_API}/team/${memberId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            return { success: false, error: "Something went wrong" }
        }

        revalidatePath('/team');

        return { success: true };
    } catch (err) {
        return { success: false, error: "An unknown error occurred." }
    }
}

export async function updateTeamMember(memberId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const {accessToken} = session!;

    const image = formData.get("image") as File;

    if (!image || image.size === 0) {
        formData.delete("image");
    }

    const updateTeamMemberSchema = z.object({
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        designation: z.string().min(1).optional(),
        image: z
            .instanceof(File)
            .optional()
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
        let res = await fetch(`${process.env.BACKEND_API}/team/${memberId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!res.ok) {
            return { success: false, error: "Something went wrong" };
        }

        const data = await res.json()
        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }


}