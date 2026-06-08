import { cookies } from "next/headers";

let refreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    const res = await fetch(`${process.env.BACKEND_API}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
        throw new Error("Refresh failed");
    }

    // IMPORTANT:
    // cookies are updated via Set-Cookie from backend response
    // no manual handling needed here
}

export async function apiFetch(path: string, options: RequestInit = {}) {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    const makeRequest = async () =>
        fetch(`${process.env.BACKEND_API}${path}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
            },
        });

    let response = await makeRequest();

    // If access token is valid, return immediately
    if (response.status !== 401) {
        return response;
    }

    // Prevent multiple parallel refresh calls
    if (!refreshing) {
        refreshing = true;
        refreshPromise = refreshAccessToken()
            .catch(() => {
                // optional: you could clear cookies or log out user here
                throw new Error("Session expired");
            })
            .finally(() => {
                refreshing = false;
            });
    }

    await refreshPromise;

    // IMPORTANT:
    // cookies() does NOT magically update inside same execution context
    // so we re-read AFTER refresh attempt
    const newCookieStore = await cookies();
    const newAccessToken = newCookieStore.get("access_token")?.value;

    if (!newAccessToken) {
        throw new Error("Failed to obtain new access token");
    }

    // retry original request with fresh token
    return fetch(`${process.env.BACKEND_API}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
        },
    });
}