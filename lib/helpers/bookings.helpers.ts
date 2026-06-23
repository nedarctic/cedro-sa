import { Booking } from "../types/booking";

export async function getBookings(
    accessToken: string, 
    page: string = "1", 
    limit: string = "10",
    search?: string
): Promise<{
    success: boolean,
    error?: string,
    data?: {
        bookings: Booking[],
        meta: {
            total: number,
            limit: number,
            page: number,
            totalPages: number,
        }
    }
}> {

    const searchParams = new URLSearchParams();
    search && searchParams.set('search', search.trim());
    searchParams.set('page', page);
    searchParams.set('limit', limit);

    const url = new URL(`${process.env.BACKEND_API}/bookings?${searchParams.toString()}`)

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export async function getBooking(accessToken: string, bookingId: string): Promise<{
    success: boolean,
    error?: string,
    data?: Booking
}> {

    try {
        const res = await fetch(`${process.env.BACKEND_API}/bookings/${bookingId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

