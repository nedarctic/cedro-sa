import { getProfileInfo } from "@/actions/profile.auth";
import { AppSidebar } from "./app-sidebar";
import { redirect } from "next/navigation";

export default async function AppSidebarWrapper(props: any) {
  const user = await getProfileInfo();

  if (!user) {
    redirect("/login");
  }

  return <AppSidebar user={user} {...props} />;
}