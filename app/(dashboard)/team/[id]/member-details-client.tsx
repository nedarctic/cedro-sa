'use client';

import { BreadCrumb } from "@/components/breadcrumb";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { removeTeamMember } from "@/actions/team.actions";
import { useRouter } from "next/navigation";
import { EditTeamMemberDialog } from "@/components/edit-team-member-dialog";
import { DeleteTeamMemberDialog } from "@/components/delete-team-member-dialog";

export default function MemberDetailsClient({
    data,
}: {
    data: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        designation: string;
        memberImage: string;
    };
}) {
    const crumbs = [
        {
            label: "Team",
            link: "/team",
        },
    ];

    const router = useRouter();

    const handleDelete = async () => {
        const res = await removeTeamMember(data.id);

        if(res.success) {
            alert("Team member removed successfully");
            router.push("/team");
        } else {
            alert("Failed to remove team member");
        }
    };

    return (
        <div>
            <BreadCrumb crumbs={crumbs} page={"Team Member Details"} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="p-6 w-full space-y-6">
                        <h1 className="font-extrabold text-xl">{data.name}</h1>

                        {/* MAIN LAYOUT */}
                        <div className="flex gap-8 items-start">

                            {/* IMAGE */}
                            <div className="relative w-75 h-80 rounded-lg overflow-hidden shrink-0 bg-muted">
                                <Image
                                    src={data.memberImage}
                                    alt={data.name}
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>

                            {/* DETAILS + ACTIONS */}
                            <div className="flex flex-col gap-6 text-sm w-full max-w-md">

                                {/* DETAILS */}
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p className="text-muted-foreground">Designation</p>
                                        <p className="font-medium">{data.designation}</p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">Description</p>
                                        <p className="leading-relaxed">{data.description}</p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">Created At</p>
                                        <p>{new Date(data.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">Last Updated</p>
                                        <p>{new Date(data.updatedAt).toLocaleDateString()}</p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">Member ID</p>
                                        <p className="font-mono text-xs">{data.id}</p>
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="border-t pt-4 flex flex-col gap-2">
                                    <EditTeamMemberDialog member={data} />

                                    <DeleteTeamMemberDialog memberId={data.id} />
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}