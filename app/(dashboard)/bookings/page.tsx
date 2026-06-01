'use client'

import { BreadCrumb } from "@/components/breadcrumb";
import { PlusIcon } from 'lucide-react';
import Link from "next/link";

export default function Page() {

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
