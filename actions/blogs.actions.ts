'use server'

import z from 'zod';
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import { refreshToken } from './auth.actions';

export async function createBlog(formData: FormData) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

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
        let res = await sendRequest(access_token);

        // 🔥 HANDLE EXPIRED TOKEN
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.access_token;

            // Retry original request with new access token
            res = await sendRequest(newAccessToken);

            if (!res.ok) {
                return { success: false, error: "Failed to create blog after refreshing token." };
            }
        } else if (!res.ok) {
            return { success: false, error: "Failed to create blog." };
        }

        revalidatePath("/blogs");
        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function createStoryForBlog(blogId: string, formData: FormData) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

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
        let res = await sendRequest(access_token);

        // 🔥 HANDLE EXPIRED TOKEN
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.access_token;

            // Retry original request with new access token
            res = await sendRequest(newAccessToken);

            if (!res.ok) {
                return { success: false, error: "Failed to create story after refreshing token." };
            }
        } else if (!res.ok) {
            return { success: false, error: "Failed to create story." };
        }

        revalidatePath("/blogs");
        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function addSectionToStory(storyId: string, formData: FormData) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

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
        let res = await sendRequest(access_token);

        // 🔥 HANDLE EXPIRED TOKEN
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.access_token;

            // Retry original request with new access token
            res = await sendRequest(newAccessToken);

            if (!res.ok) {
                return { success: false, error: "Failed to add section after refreshing token." };
            }
        } else if (!res.ok) {
            return { success: false, error: "Failed to add section." };
        }

        revalidatePath("/blogs");
        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function getBlogs() { 
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

    const sendRequest = async (token?: string) => {
        return fetch(`${process.env.BACKEND_API}/blogs`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    try {
        let res = await sendRequest(access_token);

        // 🔥 HANDLE EXPIRED TOKEN
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.access_token;

            // Retry original request with new access token
            res = await sendRequest(newAccessToken);

            if (!res.ok) {
                return { success: false, error: "Failed to fetch blogs after refreshing token." };
            }
        } else if (!res.ok) {
            return { success: false, error: "Failed to fetch blogs." };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function getBlogDetails(blogId: string) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

    const sendRequest = async (token?: string) => {
        return fetch(`${process.env.BACKEND_API}/blogs/${blogId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    try {
        let res = await sendRequest(access_token);

        // 🔥 HANDLE EXPIRED TOKEN
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.access_token;

            // Retry original request with new access token
            res = await sendRequest(newAccessToken);

            if (!res.ok) {
                return { success: false, error: "Failed to fetch blog details after refreshing token." };
            }
        } else if (!res.ok) {
            return { success: false, error: "Failed to fetch blog details." };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function getStoryByBlogId(blogId: string) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

    const sendRequest = async (token?: string) => {
        return fetch(`${process.env.BACKEND_API}/blogs/${blogId}/story`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    try {
        let res = await sendRequest(access_token);

        // 🔥 HANDLE EXPIRED TOKEN
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.access_token;

            // Retry original request with new access token
            res = await sendRequest(newAccessToken);

            if (!res.ok) {
                return { success: false, error: "Failed to fetch story after refreshing token." };
            }
        } else if (!res.ok) {
            return { success: false, error: "Failed to fetch story." };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function updateBlogStorySection(blogId: string, sectionId: string, formData: FormData) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

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
        let res = await sendRequest(access_token);

        // 🔥 HANDLE EXPIRED TOKEN
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.access_token;

            // Retry original request with new access token
            res = await sendRequest(newAccessToken);

            if (!res.ok) {
                return { success: false, error: "Failed to update section after refreshing token." };
            }
        } else if (!res.ok) {
            return { success: false, error: "Failed to update section." };
        }

        revalidatePath("/blogs");
        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function deleteBlogStorySection(storyId: string, sectionId: string) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    const refresh_token = cookieStore.get('refresh_token')?.value;

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
        let res = await sendRequest(access_token);

        // 🔥 HANDLE EXPIRED TOKEN
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." };
            }

            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.access_token;

            // Retry original request with new access token
            res = await sendRequest(newAccessToken);

            if (!res.ok) {
                return { success: false, error: "Failed to delete section after refreshing token." };
            }
        } else if (!res.ok) {
            return { success: false, error: "Failed to delete section." };
        }

        revalidatePath("/blogs");
        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}