import { BreadCrumb } from "@/components/breadcrumb";
import { getDestinations } from "@/lib/helpers/destinations.helpers";

export default async function Page() {

  const {success, error, data}: {success: boolean, error?: string, data?: any} = await getDestinations();

  if(!success){
    console.log('Error fetching destinations', error)
  } else {
    console.log('Destinations:', data);
  }

  return (
    <div>
      <BreadCrumb page={"Itineraries"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col items-center min-h-screen w-full justify-center">
            <h1>Destinations</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
