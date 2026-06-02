import { BreadCrumb } from "@/components/breadcrumb";
import { CreateNewTourComponent } from "@/components/create-new-tour-dialog";

export default async function CreateTourPage() {
    const crumbs = [
            {
                label: "Tours",
                link: "/tours"
            }
        ]
    
        return (
            <div>
                <BreadCrumb crumbs={crumbs} page={"Create Tour"} />
                <div className="flex flex-1 flex-col p-6">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col w-full">
                            <h1 className="font-extrabold">Create New Tour</h1>
                        </div>
                        <div className="w-1/2">
                            <CreateNewTourComponent />
                        </div>
    
                    </div>
                </div>
            </div>
        );
}