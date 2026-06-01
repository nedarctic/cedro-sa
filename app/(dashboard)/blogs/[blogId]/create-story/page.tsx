import { BreadCrumb } from "@/components/breadcrumb";
import { CreateBlogStory } from "@/components/create-blog-story";

export default async function Page({ params }: { params: Promise<{ blogId: string }> }) {
    const { blogId } = await params;

    const crumbs = [
        {
            label: "Blogs",
            link: "/blogs"
        },
        {
            label: "Blog Details",
            link: `/blogs/${blogId}`
        }
    ]

    return (
        <div>
            <BreadCrumb crumbs={crumbs} page="Create Story" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="p-6 flex flex-col w-full space-y-6">
                        <div className="flex justify-between">
                            <h1 className="font-extrabold">Create a story for the blog</h1>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <CreateBlogStory blogId={blogId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}