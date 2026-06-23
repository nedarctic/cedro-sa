import { Guide } from "./guide";
import { Tour } from "./tour";

export type Itinerary = {
    id: string,
    name: string,
    tourId: string,
    destinationImage: string,
    imageKey?: String,
    tour: Tour[],
    guide: Guide[],
    createdAt: string,
    updatedAt: string,
}