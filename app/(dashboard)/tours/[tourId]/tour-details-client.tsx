import { BreadCrumb } from "@/components/breadcrumb";
import { FileExclamationPoint } from 'lucide-react';
import Image from "next/image";
import { type Tour } from "../page";
import { UpdateTourDialog } from "@/components/edit-tour-dialog";

export function TourDetailsClient({ data }: { data?: Tour }) {

    const crumbs = [
        { label: 'Tours', link: '/tours' }
    ];

    return (
        <div>
            <BreadCrumb crumbs={crumbs} page={"Tour Details"} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="p-6 w-full space-y-6">

                        <h1 className="font-extrabold text-xl">
                            {data?.title}
                        </h1>

                        <div className="relative w-160 h-90">
                            <Image src={data?.tourImage!} alt="Tour image" fill className="object-cover object-top rounded-lg" />
                        </div>

                        <p>{data?.intro}</p>

                        <div className="flex lg:flex-row flex-col gap-4">

                            <div className="flex flex-col w-full lg:w-1/2 space-y-4">

                                <div className="flex flex-col space-y-2">
                                    <p><span className="font-semibold">Dates:</span> {data?.dates}</p>
                                    <p><span className="font-semibold">Duration:</span> {data?.duration}</p>
                                    <p><span className="font-semibold">Group size:</span> {data?.groupSize}</p>
                                    <p><span className="font-semibold">Total bookings:</span> {data?.bookings ? data.bookings.length : 0}</p>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <h1 className="font-bold">Activities</h1>
                                    <ul className="list-disc pl-4">
                                        {data?.activities.map((activity, id) => (<li key={id} className="font-normal">{activity}</li>))}
                                    </ul>
                                </div>

                                <div>
                                    {
                                        data?.destination
                                            ? <p><span>Destination:</span> <span className="font-extrabold">{data.destination.name}</span></p>
                                            : <div className="flex flex-col gap-6">
                                                <p className="flex gap-2 items-center font-bold text-red-600"><FileExclamationPoint size={24} color={"red"} />Destination not set.</p>
                                            </div>
                                    }
                                </div>
                            </div>

                            <div className="flex flex-col w-full lg:w-1/2 space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <h1 className="font-bold">What&apos;s included</h1>
                                    <ul className="list-disc pl-4">
                                        {data?.included.map((included, id) => (<li key={id} className="font-normal">{included}</li>))}
                                    </ul>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <h1 className="font-bold">What&apos;s Excluded</h1>
                                    <ul className="list-disc pl-4">
                                        {data?.excluded.map((excluded, id) => (<li key={id} className="font-normal">{excluded}</li>))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <UpdateTourDialog tour={data!} />
                    </div>
                </div>
            </div>
        </div>
    );
}