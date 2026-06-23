import { Booking } from "./booking";
import { Destination } from "./destination";
import { Itinerary } from "./itinerary";

export type Tour = {
    id: string,
    destination?: Destination,
    dates: string,
    duration: string,
    groupSize: string,
    price: string,
    title: string,
    intro: string,
    tourImage: string,
    imageKey?: string,
    included?: string[],
    excluded?: string[],
    activities?: string[],
    itinerary?: Itinerary[],
    bookings?: Booking[],
    createdAt: string,
    updatedAt: string,
    destinationId: string,
}