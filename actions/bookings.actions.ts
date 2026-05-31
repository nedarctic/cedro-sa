'use server'

import { cookies } from "next/headers"
import z from 'zod';

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
    if (res.status === 401) {
      const refreshRes = await fetch(`${process.env.BACKEND_API}/auth/refresh`, {
        method: "POST",
        credentials: "include", // sends refresh_token cookie
      });

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
    const token = (await cookies()).get('access_token')?.value;
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

    try {
        const res = await fetch(`${process.env.BACKEND_API}/bookings`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(parsedData.data)
        });
        return { success: true }
    } catch (err) {
        return { success: false, error: "An error occurred" }
    }
}

export async function updateBooking(bookingId: string, formData: FormData): Promise<BookingState> {
    const token = (await cookies()).get('access_token')?.value;
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

    try {
        const res = await fetch(`${process.env.BACKEND_API}/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(parsedData.data)
        })

        return { success: true }
    } catch (err) {
        return { success: false, error: "An error occurred." }
    }
}

export async function deleteBooking(bookingId: string) {

    const token = (await cookies()).get('access_token')?.value;
    try {
        const res = await fetch(`${process.env.BACKEND_API}/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        return { success: true }
    } catch (err) {
        return { success: false, error: "An error occurred" }
    }
}