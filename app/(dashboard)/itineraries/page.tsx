import { BreadCrumb } from "@/components/breadcrumb";

export default function Page() {
  return (
    <div>
      <BreadCrumb page={"Itineraries"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col items-center min-h-screen w-full justify-center">
            <h1>Itineraries</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
