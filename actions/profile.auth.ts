'use server'

import { cookies } from "next/headers"

export async function getProfileInfo() {

    const token = (await cookies()).get("access_token")?.value;

    try {
        const res = await fetch(`${process.env.BACKEND_API}/users/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            throw new Error("User not logged in.")
        }

        const user = await res.json();
        return user;
    } catch (error) { 
        return {error: "An error occurred."}
    }
}