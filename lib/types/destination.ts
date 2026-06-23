import { Guide } from "./guide"
import { Tour } from "./tour"

export type Destination = {
    id: string,
    name: string,
    tourId?: string,
    destinationImage: string,
    imageKey?: string,
    tour?: Tour[],
    guide?: Guide[],
    createdAt: string,
    updatedAt: string,
}