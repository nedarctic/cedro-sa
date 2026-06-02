import { BreadCrumb } from "@/components/breadcrumb";
import { TableData } from "@/components/table-data";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function BlogClient({ initialData }: { initialData: any[] }) {

    const headers = [
        { label: "Title", key: "title" },
        { label: "Date", key: "date" },
    ];

    return (
        <div>
            <BreadCrumb page={"Blogs"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="p-6 flex flex-col w-full space-y-6">
                        <div className="flex justify-between">
                            <h1 className="font-extrabold">Blogs</h1>
                            <Link href="/blogs/create" className="flex bg-black rounded-lg p-2 text-white text-sm items-center justify-center gap-3">Create new blog<PlusIcon color="white" size={16} /></Link>
                        </div>
                        <TableData headers={headers} data={initialData} path="blogs" caption="Blog Posts"/>
                    </div>
                </div>
            </div>
        </div>
    )
}