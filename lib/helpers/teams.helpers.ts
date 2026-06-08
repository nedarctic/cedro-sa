import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getTeamMembers(): Promise<{ success: boolean; error?: string; data?: any }> {
    const session = await getServerSession(authOptions);
    const { accessToken: access_token } = session!;

    try {

        let res = await fetch(`${process.env.BACKEND_API}/team`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        if (!res.ok) {
            return { success: false, error: "Failed to get team members" };
        }

        const data = await res.json();

        return { success: true, data };
    } catch (err) {
        return { success: false, error: "An unknown error occurred." }
    }
}

export async function getTeamMember(memberId: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const session = await getServerSession(authOptions);
    const { accessToken: access_token } = session!;

    try {

        let res = await fetch(`${process.env.BACKEND_API}/team/${memberId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        if (!res.ok) {
            return { success: false, error: "Something went wrong" }
        }

        const data = await res.json();

        return { success: true, data }
    } catch (err) {
        return { success: false, error: "An unknown error occurred" }
    }
}