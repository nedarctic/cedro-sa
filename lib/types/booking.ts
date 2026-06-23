import { Tour } from "./tour";

export type Booking = {
    id: string,
    email: string,
    name: string,
    tourId: string,
    tourName?: string,
    tour: Tour,
    createdAt: string,
    updatedAt: string,
}