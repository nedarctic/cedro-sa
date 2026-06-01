import { BreadCrumb } from "@/components/breadcrumb";

export default function CreateBookingPage() {

    const crumbs = [
        {
            label: "Bookings",
            link: "/bookings"
        }
    ]
    return (
        <div>
            <BreadCrumb crumbs={crumbs} page={"Create New Booking"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="p-6 flex flex-col w-full">
                        <h1 className="font-extrabold">Create New Booking</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}