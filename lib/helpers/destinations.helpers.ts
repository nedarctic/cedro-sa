import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import z from 'zod';

/*

getDestinations(): GET tours/destinations
getDestination(destinationId): GET tours/destinations/destinationId
createDestination(name, destinationImage): POST tours/destinations
deleteDestination(destinationId): DELETE tours/destinations/destinationId
updateDestination(destinationId, name?, destinationImage?): PATCH tours/destinations/destinationId

*/

export async function getDestinations() {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!; 

    try{
        const res = await fetch(`${process.env.BACKEND_API}/destinations`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if(!res.ok){
            const errorMessage = await res.json();
            return {success: false, error: errorMessage};
        }

        const data = await res.json();

        return {success: true, data}
    } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : String(error)};
    }
}

export async function getDestination(destinationId: string) { 
    const session = await getServerSession(authOptions);
    const { accessToken } = session!; 

    try{
        const res = await fetch(`${process.env.BACKEND_API}/destinations/${destinationId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(!res.ok){
            const errorMessage = await res.json();
            return {success: false, errorMessage};
        }

        const data = await res.json();

        return {success: true, data}
    } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : String(error)};
    }
}
