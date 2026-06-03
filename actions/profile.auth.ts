'use server'

import { cookies } from "next/headers"
import { refreshToken } from "./auth.actions";

export async function getProfileInfo() {
    const cookieStore = await cookies();

    let access_token = cookieStore.get("access_token")?.value;

    const fetchProfile = async (token: string | undefined) => {
        return fetch(`${process.env.BACKEND_API}/users/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });
    };

    try {
        let res = await fetchProfile(access_token);

        // If access token expired → try refresh
        if (res.status === 401 || res.status === 403) {
            const refreshRes = await refreshToken();

            if (!refreshRes.ok) {
                throw new Error("Session expired");
            }

            const {access_token} = await refreshRes.json();

            // retry request with new token
            res = await fetchProfile(access_token);
        }

        if (!res.ok) {
            throw new Error("Failed to fetch profile");
        }

        return await res.json();
    } catch (error) {
        return null;
    }
}