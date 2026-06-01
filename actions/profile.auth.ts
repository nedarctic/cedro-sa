'use server'

import { cookies } from "next/headers"

export async function getProfileInfo() {
    const cookieStore = await cookies();

    let access_token = cookieStore.get("access_token")?.value;
    let refresh_token = cookieStore.get("refresh_token")?.value;

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
            const refreshRes = await fetch(`${process.env.BACKEND_API}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refresh_token }),
            });

            if (!refreshRes.ok) {
                throw new Error("Session expired");
            }

            const tokens = await refreshRes.json();

            // Update cookies
            cookieStore.set("access_token", tokens.accessToken);
            cookieStore.set("refresh_token", tokens.refreshToken);

            // retry request with new token
            res = await fetchProfile(tokens.accessToken);
        }

        if (!res.ok) {
            throw new Error("Failed to fetch profile");
        }

        return await res.json();
    } catch (error) {
        return null;
    }
}