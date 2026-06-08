import { BreadCrumb } from "@/components/breadcrumb";
import { PlusIcon } from 'lucide-react';
import Link from "next/link";
import { getBookings } from "@/lib/helpers/bookings.helpers";

export default async function Page() {

  const {success, error, data}: {success: boolean; error?: string; data?: any} = await getBookings();

  if(!success){
    console.log('An error occurred fetching bookings', error);
  } else {
    console.log('Bookings data', data);
  }

  return (
    <div>
      <BreadCrumb page={"Bookings"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="p-6 flex flex-col w-full">
            <div className="flex justify-between">
              <h1 className="font-extrabold">Bookings</h1>
              <Link href="/bookings/create" className="flex bg-black rounded-lg p-2 text-white text-sm items-center justify-center gap-3">Create new booking <PlusIcon color="white" size={16} /></Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
