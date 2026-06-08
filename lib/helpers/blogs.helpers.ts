import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getBlogs() {

    const session = await getServerSession(authOptions);
    const { accessToken: access_token } = session!;

    try {
        let res = await fetch(`${process.env.BACKEND_API}/blogs`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            return { success: false, error: "Failed to fetch blogs." };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function getBlogDetails(blogId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken: access_token } = session!;

    try {
        let res = await fetch(`${process.env.BACKEND_API}/blogs/${blogId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            return { success: false, error: "Failed to fetch blog details." };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function getStoryByBlogId(blogId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken: access_token } = session!;

    try {
        let res = await fetch(`${process.env.BACKEND_API}/blogs/${blogId}/story`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        
        if (!res.ok) {
            return { success: false, error: "Failed to fetch story." };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." };
    }
}