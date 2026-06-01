"use client";

import { useState } from "react";
import { TableData } from "@/components/table-data";
import { BreadCrumb } from "@/components/breadcrumb";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default function TeamClient({ initialData }: { initialData: any[] }) {
  const [teamMembers] = useState(initialData);

  const headers = [
    { label: "Name", key: "name" },
    { label: "Designation", key: "designation" },
  ];

  return (
    <div>
      <BreadCrumb page={"Team"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="p-6 flex flex-col w-full space-y-6">
            <div className="flex justify-between">
              <h1 className="font-extrabold">Team</h1>
              <Link href="/team/create" className="flex bg-black rounded-lg p-2 text-white text-sm items-center justify-center gap-3">Add new member <PlusIcon color="white" size={16} /></Link>
            </div>
            <TableData headers={headers} data={teamMembers} path="team" caption="Team Members" />
          </div>
        </div>
      </div>
    </div>
  );
}