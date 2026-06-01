import MemberDetailsClient from "./member-details-client";
import { getTeamMember } from "@/actions/team.actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const teamMember = await getTeamMember(id);

    console.log('Team member', teamMember);

    return <MemberDetailsClient data={teamMember.data} />
}