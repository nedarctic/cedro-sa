import { getTeamMembers } from "@/lib/helpers/teams.helpers";
import TeamClient from "./team-client";

export default async function Page() {
  const res = await getTeamMembers();

  const teamMembers =
    res.success
      ? res.data.map((member: any) => ({
        id: member.id,
        name: member.name,
        designation: member.designation,
      }))
      : [];

  return <TeamClient initialData={teamMembers} />;
}