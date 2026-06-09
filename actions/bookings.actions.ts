import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import z from "zod";

export async function createBooking(tourId: string, formData: FormData) {

    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createBookingSchema = z.object({
        email: z.email('Invalid email'),
        name: z.string().min(1, 'Name is required'),
    });

    const parsedData = createBookingSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
    });

    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    try {

        const res = await fetch(`${process.env.BACKEND_API}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage };
        }


        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export async function updateBooking(bookingId: string, formData: FormData) {

    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createBookingSchema = z.object({
        email: z.email('Invalid email').optional(),
        name: z.string().min(1, 'Name is required').optional(),
    });

    const parsedData = createBookingSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
    });

    if (!parsedData.success) {
        return { success: false, error: parsedData.error.message };
    }

    try {

        const res = await fetch(`${process.env.BACKEND_API}/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage };
        }


        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export async function deleteBooking(bookingId: string) {

    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_API}/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}