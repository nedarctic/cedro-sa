import { BreadCrumb } from "@/components/breadcrumb";
import type { Tour } from "./page";
import { TableData } from "@/components/table-data";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export function TourClient({ initialData }: { initialData: Tour[] }) {

    const headers = [
        { key: "title", label: "Title" },
        { key: "price", label: "Price" },
        { key: "dates", label: "Dates" },
    ];

    return (
        <div>
            <BreadCrumb page={"Tours"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="p-6 flex flex-col w-full space-y-6">
                        <div className="flex justify-between">
                            <h1 className="font-extrabold">Tours</h1>
                            <Link href="/tours/create" className="flex bg-black rounded-lg p-2 text-white text-sm items-center justify-center gap-3">Create new tour<PlusIcon color="white" size={16} /></Link>
                        </div>
                        <TableData headers={headers} data={initialData} path="tours" caption="Available Tours" />
                    </div>
                </div>
            </div>
        </div>
    )
}