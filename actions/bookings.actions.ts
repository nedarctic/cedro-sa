'use server'

import { cookies } from "next/headers"
import z from 'zod';
import { refreshToken } from "./auth.actions";

export type Booking = {
    id: string;
    email: string;
    name: string;
    tourId: string;
    createdAt: string
}

export async function getBookings() {
    const cookieStore = await cookies();

    let accessToken = cookieStore.get("access_token")?.value;

    async function fetchBookings(token?: string) {
        return fetch(`${process.env.BACKEND_API}/bookings`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });
    }

    try {
        // 1. First attempt
        let res = await fetchBookings(accessToken);

        // 2. If expired → refresh
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, err: "SESSION_EXPIRED" };
            }

            const data = await refreshRes.json();

            // update access token in cookie store (Next.js side)
            cookieStore.set("access_token", data.access_token);

            // retry with new token
            res = await fetchBookings(data.access_token);
        }

        if (!res.ok) {
            return { success: false, err: "REQUEST_FAILED" };
        }

        const bookings = await res.json();

        return { success: true, data: bookings };
    } catch (err) {
        return { success: false, err: "NETWORK_ERROR" };
    }
}

export type BookingState = {
    success: boolean;
    error?: string;
}

export async function createBooking(formData: FormData): Promise<BookingState> {
    const access_token = (await cookies()).get('access_token')?.value;
    const createBookingSchema = z.object({
        tourId: z.string(),
        email: z.email('Invalid email'),
        name: z.string()
    });

    const parsedData = createBookingSchema.safeParse({
        tourId: formData.get('tourId'),
        email: formData.get('email'),
        name: formData.get('name')
    });

    if (parsedData.error) {
        return { success: false, error: parsedData.error.message }
    }

    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/bookings`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify(parsedData.data)
        });
    }

    try {
        let res = await sendRequest(access_token!);

        if (res.status === 401 || res.status === 403) {
            let refreshRes = await refreshToken();


            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please log in again." }
            }

            const { access_token } = await refreshRes.json();

            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Something went wrong" }
        }

        return { success: true }
    } catch (err) {
        return { success: false, error: "An error occurred" }
    }
}

export async function updateBooking(bookingId: string, formData: FormData): Promise<BookingState> {
    const access_token = (await cookies()).get('access_token')?.value;
    const updateBookingSchema = z.object({
        tourId: z.string().optional(),
        email: z.email('Invalid email').optional(),
        name: z.string().optional()
    });

    const parsedData = updateBookingSchema.safeParse({
        tourId: formData.get('tourId'),
        email: formData.get('email'),
        name: formData.get('name')
    });

    if (parsedData.error) {
        return { success: false, error: parsedData.error.message }
    }

    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify(formData)
        })
    }

    try {

        let res = await sendRequest(access_token!);

        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();


            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." }
            }

            const { access_token } = await refreshRes.json();

            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Something went wrong" }
        }

        return { success: true }
    } catch (err) {
        return { success: false, error: "An error occurred." }
    }
}

export async function deleteBooking(bookingId: string) {

    const access_token = (await cookies()).get('access_token')?.value;

    const sendRequest = async (access_token: string) => {
        return await fetch(`${process.env.BACKEND_API}/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });
    }

    try {

        let res = await sendRequest(access_token!);

        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                return { success: false, error: "Session expired. Please login again." }
            }

            const { access_token } = await refreshRes.json();
            res = await sendRequest(access_token);
        }

        if (!res.ok) {
            return { success: false, error: "Something went wrong." }
        }

        return { success: true }

    } catch (err) {
        return { success: false, error: "An error occurred" }
    }
}