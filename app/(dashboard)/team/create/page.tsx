'use client'

import { BreadCrumb } from "@/components/breadcrumb";
import { CreateTeamMemberInputGroup } from "@/components/create-team-member";

export default function CreateTeamNewMemberPage() {

    const crumbs = [
        {
            label: "Team",
            link: "/team"
        }
    ]
    return (
        <div>
            <BreadCrumb crumbs={crumbs} page={"Create New Team Member"} />
            <div className="flex flex-1 flex-col p-6">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col w-full">
                        <h1 className="font-extrabold">Add New Team Member</h1>
                    </div>
                    <div className="w-1/2">
                        <CreateTeamMemberInputGroup />
                    </div>

                </div>
            </div>
        </div>
    )
}