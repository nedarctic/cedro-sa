import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getItinerary(tourId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken: access_token } = session!;

    try {
        let res = await fetch(`${process.env.BACKEND_API}/itineraries/tour/${tourId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            return { success: false, error: "Something went wrong." }
        }

        const data = await res.json();

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred." }
    }
}