import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@/components/ui/separator"

export function BreadCrumb({ crumbs, page }: { crumbs?: { label: string; link: string }[], page: string }) {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-8"
                />
                <Breadcrumb >
                    <BreadcrumbList>
                        {crumbs?.map(crumb => (
                            <div key={crumb.link} className="flex items-center">
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={crumb.link}>{crumb.label}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </div>))}
                        <BreadcrumbItem>
                            <BreadcrumbPage>{page}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}