'use server'

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { revalidatePath } from "next/cache";
import z from 'zod';

export async function createBlog(formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createBlogSchema = z.object({
        title: z.string().min(1, "Title is required"),
        date: z.string(),
        excerpt: z.string().max(200, "Excerpt must be less than 200 characters"),
        image: z.instanceof(File).refine(file => file.type.startsWith('image/'), "File must be an image"),
    });
    const parsedData = createBlogSchema.safeParse({
        title: formData.get("title") as string,
        date: formData.get("date") as string,
        excerpt: formData.get("excerpt") as string,
        image: formData.get("image") as File,
    });
    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    const sendRequest = async (token?: string) => {
        return fetch(`${process.env.BACKEND_API}/blogs`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
    }

    try {
        let res = await sendRequest(accessToken);

        if (!res.ok) {
            return { success: false, error: "Failed to create blog." };
        }

        const data = await res.json();

        revalidatePath("/blogs");
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function createStoryForBlog(blogId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createStorySchema = z.object({
        intro: z.string().min(1, "Intro is required"),
        conclusion: z.string().min(1, "Conclusion is required"),
    });
    const parsedData = createStorySchema.safeParse({
        intro: formData.get("intro") as string,
        conclusion: formData.get("conclusion") as string,
    });

    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    const sendRequest = async (token?: string) => {
        return fetch(`${process.env.BACKEND_API}/blogs/${blogId}/story`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedData.data),
        });
    }

    try {
        let res = await sendRequest(accessToken);

        if (!res.ok) {
            return { success: false, error: "Failed to create story." };
        }

        const data = await res.json();

        revalidatePath("/blogs");
        return { success: true , data};
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function addSectionToStory(storyId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createSectionSchema = z.object({
        subtitle: z.string().min(1, "Subtitle is required"),
        content: z.string().min(1, "Content is required"),
    });
    const parsedData = createSectionSchema.safeParse({
        subtitle: formData.get("subtitle") as string,
        content: formData.get("content") as string,
    });

    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    const sendRequest = async (token?: string) => {
        return fetch(`${process.env.BACKEND_API}/blogs/story/${storyId}/section`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedData.data),
        });
    }

    try {
        let res = await sendRequest(accessToken);

        if (!res.ok) {
            return { success: false, error: "Failed to add section." };
        }

        const data = await res.json();
        revalidatePath("/blogs");
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function updateBlogStorySection(blogId: string, sectionId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const updateSectionSchema = z.object({
        subtitle: z.string().min(1, "Subtitle is required"),
        content: z.string().min(1, "Content is required"),
    });
    const parsedData = updateSectionSchema.safeParse({
        subtitle: formData.get("subtitle") as string,
        content: formData.get("content") as string,
    });

    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    // @Patch('story/:storyId/section/:sectionId')
    const sendRequest = async (token?: string) => {
        return fetch(`${process.env.BACKEND_API}/blogs/story/${blogId}/section/${sectionId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedData.data),
        });
    }

    try {
        let res = await sendRequest(accessToken);

        if (!res.ok) {
            return { success: false, error: "Failed to update section." };
        }

        const data = await res.json();
        revalidatePath("/blogs");
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function deleteBlogStorySection(storyId: string, sectionId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    //  @Delete('story/:storyId/section/:sectionId')
    const sendRequest = async (token?: string) => {
        return fetch(`${process.env.BACKEND_API}/blogs/story/${storyId}/section/${sectionId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    try {
        let res = await sendRequest(accessToken);

        if (!res.ok) {
            return { success: false, error: "Failed to delete section." };
        }

        const data = await res.json();
        revalidatePath("/blogs");
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}