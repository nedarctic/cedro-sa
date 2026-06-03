import { BreadCrumb } from "@/components/breadcrumb";
import type { Itinerary } from "../../page";
import Image from "next/image";
import { CreateNewItineraryDialog } from "@/components/create-new-itinerary-dialog";
import { DeleteItineraryDialog } from "@/components/delete-itinerary-dialog";

export function CreateEditItineraryClient({ itinerary, tourId, tourTitle }: { itinerary?: Itinerary[], tourId: string, tourTitle: string }) {

    const crumbs = [
        { label: "Tours", link: "/tours" },
        { label: "Tour Details", link: `/tours/${tourId}` },
    ];

    return (
        <div>
            <BreadCrumb crumbs={crumbs} page={"Create/Edit Itinerary"} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="p-6 w-full space-y-6">

                        <div className="flex justify-between">
                            <h1 className="font-extrabold text-xl">
                                Itinerary for {tourTitle} Tour
                            </h1>
                        </div>

                        {itinerary?.length! > 0 && itinerary?.map(itinerary => (
                            <div key={itinerary.id} className="flex flex-col gap-3 border border-gray-300 rounded-2xl p-6">
                                <h1 className="font-semibold">{itinerary.title}</h1>

                                <div className="relative w-150 h-80">
                                    <Image src={itinerary.dayImage} alt={`${itinerary.title} image`} fill className="object-cover object-top rounded-lg" />
                                </div>

                                <p className="font-medium">{itinerary.day}</p>

                                <div className="gap-2 flex flex-col">
                                    <p className="font-semibold text-lg">Activities</p>
                                    <ul className="list-disc pl-4">
                                        {itinerary.activities.map((activity, id) => (<li key={id}>{activity}</li>))}
                                    </ul>
                                </div>

                                <DeleteItineraryDialog itineraryId={itinerary.id} />
                            </div>
                        ))}

                        <CreateNewItineraryDialog tourId={tourId} />
                    </div>
                </div>
            </div>
        </div>
    )
}