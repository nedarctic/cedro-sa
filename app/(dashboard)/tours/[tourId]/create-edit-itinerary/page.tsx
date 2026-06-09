import { getItinerary } from "@/lib/helpers/itineraries.helpers";
import { getTour } from "@/lib/helpers/tours.helpers";
import { type Itinerary, type Tour } from "../../page";
import { CreateEditItineraryClient } from "./create-edit-itinerary-client";

export default async function Page({ params }: { params: Promise<{ tourId: string }> }) {
    const { tourId } = await params;
    const { success, data, error }: { success: boolean, data?: Itinerary[], error?: string } = await getItinerary(tourId);
    const {success: tourSuccess, data: tourData, error: tourError}: { success: boolean, data?: Tour, error?: string } = await getTour(tourId);
    
    if(!success){
        // console.error('Error fetching itinerary', error)
    } else {
        // console.log('Itineraries data', data)
    }

    if(!tourSuccess){
        console.error('Error fetching tour details', tourError)
    }

    return (<CreateEditItineraryClient itinerary={data} tourId={tourId} tourTitle={tourData?.title!} />);
}