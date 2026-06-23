import { Destination } from "./destination";

export type Guide = {
    id: string,
    subtitle: string,
    content: string,
    destinationId: string,
    destination: Destination,
    createdAt: string,
    updatedAt: string,
}