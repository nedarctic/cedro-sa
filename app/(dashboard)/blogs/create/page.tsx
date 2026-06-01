import { BreadCrumb } from "@/components/breadcrumb";
import { CreateNewBlogComponent } from "@/components/create-new-blog";

export default async function CreateBlog() {
    const crumbs = [
        {
            label: "Blogs",
            link: "/blogs"
        }
    ]

    return (
        <div>
            <BreadCrumb crumbs={crumbs} page={"Create Blog"} />
            <div className="flex flex-1 flex-col p-6">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col w-full">
                        <h1 className="font-extrabold">Create New Blog</h1>
                    </div>
                    <div className="w-1/2">
                        <CreateNewBlogComponent />
                    </div>

                </div>
            </div>
        </div>
    );
}