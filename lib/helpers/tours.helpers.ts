import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getTours() {
    const session = await getServerSession(authOptions);
    const { accessToken: access_token } = session!;

    try {
        let res = await fetch(`${process.env.BACKEND_API}/tours`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`Failed to fetch tours: ${errorData.message || res.statusText}`);
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function getTour(tourId: string) {

    const session = await getServerSession(authOptions);
    const { accessToken: access_token } = session!;

    try {
        let response = await fetch(`${process.env.BACKEND_API}/tours/${tourId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch tour: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }

}