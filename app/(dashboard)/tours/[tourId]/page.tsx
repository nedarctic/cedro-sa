import { TourDetailsClient } from "./tour-details-client";
import { getTour } from "@/lib/helpers/tours.helpers";
import { type Tour } from "../page";

export default async function TourDetailsPage ({params}: {params: Promise<{tourId: string}>}) {
    const {tourId} = await params;

    const {success, data, error }: {success: boolean; data?: Tour; error?: string} = await getTour(tourId);

    return (
        <TourDetailsClient data={data}/>
    )


}