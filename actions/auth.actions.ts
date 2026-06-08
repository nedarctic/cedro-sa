'use server'

import z from 'zod'
import { cookies } from 'next/headers'

export type LoginState = {
    success: boolean;
    error?: string;
};

export async function LoginAction(formData: FormData): Promise<LoginState> {

    const LoginSchema = z.object({
        email: z.email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
    });

    const parsedData = LoginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (parsedData.error) {
        const errorMessage = parsedData.error.message;
        return { success: false, error: errorMessage };
    }

    try {
        const response = await fetch(`${process.env.BACKEND_API}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(parsedData.data),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Login failed' };
        }

        const responseData = await response.json();
        (await cookies()).set("access_token", responseData.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        });

        (await cookies()).set("refresh_token", responseData.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        return { success: true };
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function LogoutAction() {
    try {
        (await cookies()).delete("access_token");
        (await cookies()).delete("refresh_token");
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false };
    }
}

export async function refreshToken() {
    const cookieStore = await cookies();
    const refresh_token = cookieStore.get("refresh_token")?.value;
    const access_token = cookieStore.get("access_token")?.value;

    console.log("Access token before:", access_token)

    const res = await fetch(`${process.env.BACKEND_API}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const data = await res.json();

    console.log('Access token after refresh:', data.access_token)

    cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
    });

    cookieStore.set("refresh_token", data.newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
    });

    return res;
}