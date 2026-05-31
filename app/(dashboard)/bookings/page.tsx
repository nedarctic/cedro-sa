'use client'

import { SiteHeader } from "@/components/site-header";
import { getBookings } from "@/actions/bookings.actions";
import { useTransition, useState, useEffect } from "react";
import { Booking } from "@/actions/bookings.actions";

export default function Page() {

  const [bookings, setBookings] = useState<Booking[]>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const { data } = await getBookings();
      setBookings(data);
    })
  }, []);

  return (
    <div>
      <SiteHeader title="Blogs" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="p-6">
            Bookings
            <div>
              {typeof bookings}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
