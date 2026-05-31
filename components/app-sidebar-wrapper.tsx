import { getProfileInfo } from "@/actions/profile.auth";
import { AppSidebar } from "./app-sidebar";

export default async function AppSidebarWrapper(props: any) {
  const user = await getProfileInfo();

  return <AppSidebar user={user} {...props} />;
}