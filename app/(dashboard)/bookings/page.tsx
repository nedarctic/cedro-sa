import { BreadCrumb } from "@/components/breadcrumb";
import { PlusIcon } from 'lucide-react';
import Link from "next/link";
import { getBookings } from "@/lib/helpers/bookings.helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { TableData } from "@/components/table-data";
import { PaginationComponent } from "@/components/pagination";
import SearchInput from "@/components/search-input";

export default async function Page({ searchParams }: {
  searchParams: Promise<{
    page?: string,
    limit?: string,
    search?: string,
  }>
}) {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const { accessToken } = session;
  const { search, limit, page } = await searchParams;

  const {
    success,
    error,
    data
  } = await getBookings(accessToken, page, limit, search);

  if (!success) {
    console.log('An error occurred fetching bookings', error);
  } else {
    console.log('Bookings data', data);
  }

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Tour', key: 'tourName' },
  ]

  return (
    <div>
      <BreadCrumb page={"Bookings"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="p-6 gap-6 flex flex-col w-full">
            <div className="flex justify-between">
              <h1 className="font-extrabold">Bookings</h1>
              <Link href="/bookings/create" className="flex bg-black rounded-lg p-2 text-white text-sm items-center justify-center gap-3">Create new booking <PlusIcon color="white" size={16} /></Link>
            </div>

            <SearchInput placeholder="Search bookings..." />
            <TableData headers={headers} data={data?.bookings} />
            <PaginationComponent meta={data?.meta!} />
          </div>

        </div>
      </div>
    </div>
  )
}
