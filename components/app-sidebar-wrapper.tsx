import { getProfileInfo } from "@/lib/helpers/user.helpers";
import { AppSidebar } from "./app-sidebar";

export default async function AppSidebarWrapper(props: any) {
  const user = await getProfileInfo();

  return <AppSidebar user={user} {...props} />;
}