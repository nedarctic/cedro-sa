'use server'

import { cookies } from "next/headers"
import z from 'zod'
import { revalidatePath } from "next/cache"
import { refreshToken } from "./auth.actions"
import { access } from "fs"

export type TeamMemberOperationStatus = {
    success: boolean;
    error?: string;
}

export async function addTeamMember(formData: FormData): Promise<TeamMemberOperationStatus> {
    const cookieStore = await cookies();

    let access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

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

    const sendRequest = async (token?: string) => {
        return fetch(`${process.env.BACKEND_API}/team`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
    };

    try {
        let res = await sendRequest(access_token);

        if (res.status === 401  || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const { access_token } = await refreshRes.json();

            // retry request
            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Failed to create team member" };
        }

        revalidatePath('/team');

        return { success: true };

    } catch (err) {
        return { success: false, error: "An unknown error occurred." };
    }
}

export async function removeTeamMember(memberId: string): Promise<TeamMemberOperationStatus> {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;

    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/team/${memberId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
    }
    try {
        let res = await sendRequest(access_token!);

        if (res.status === 401  || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const { access_token } = await refreshRes.json();

            // retry request
            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Something went wrong" }
        }

        revalidatePath('/team');

        return { success: true };
    } catch (err) {
        return { success: false, error: "An unknown error occurred." }
    }
}

export async function getTeamMembers(): Promise<{ success: boolean; error?: string; data?: any }> {
    const cookieStore = await cookies();

    let access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

    const sendRequest = async (token?: string) => {
        return await fetch(`${process.env.BACKEND_API}/team`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    console.log('Access token before in teams:', access_token)

    try {

        let res = await sendRequest(access_token);

        if (res.status === 401  || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const tokens = await refreshRes.json();

            access_token = tokens.accessToken;

            console.log('Access token after refresh in teams', access_token)

            // retry request
            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Failed to get team members" };
        }

        const data = await res.json();

        return { success: true, data };
    } catch (err) {
        return { success: false, error: "An unknown error occurred." }
    }
}

export async function getTeamMember(memberId: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const access_token = (await cookies()).get('access_token')?.value;

    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/team/${memberId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
    }

    try {

        let res = await sendRequest(access_token!);

        if (res.status === 401  || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." }
            }

            const { access_token } = await refreshRes.json()

            // retry request again
            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Something went wrong" }
        }

        const data = await res.json();

        return { success: true, data }
    } catch (err) {
        return { success: false, error: "An unknown error occurred" }
    }
}

export async function updateTeamMember(memberId: string, formData: FormData) {
    const access_token = (await cookies()).get('access_token')?.value;

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

    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/team/${memberId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: formData,
        });
    }

    try {
        let res = await sendRequest(access_token!);

        if (res.status === 401  || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." }
            }

            const { access_token } = await refreshRes.json();

            // retry request
            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Something went wrong" };
        }

        const data = await res.json()
        return { success: true, data }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }


}