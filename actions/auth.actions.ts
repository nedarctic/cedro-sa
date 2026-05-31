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

    console.log('Parsed Data:', parsedData);

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
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Login failed' };
        }

        const responseData = await response.json();
        console.log('Server response:', responseData);
        (await cookies()).set("access_token", responseData.access_token, {
            httpOnly: true,
            secure: true,
            path: "/",
        });

        return { success: true };
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}