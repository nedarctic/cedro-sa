import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getProfileInfo() {
    const session = await getServerSession(authOptions);
    const { accessToken: access_token } = session!;

    try {
        let res = await fetch(`${process.env.BACKEND_API}/users/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch profile");
        }

        return await res.json();
    } catch (error) {
        return null;
    }
}