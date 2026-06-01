import { getBlogDetails } from "@/actions/blogs.actions";
import { BlogDetailsClient } from "./blog-details-client";

export type BlogDetails = {
    blogImage: string;
    createdAt: string;
    date: string;
    excerpt: string;
    id: string;
    story?: {
        intro: string;
        conclusion: string;
        id: string;
        createdAt: string;
        updatedAt: string;
        blogId: string;
        sections?: {
            id: string;
            createdAt: string;
            updatedAt: string;
            subtitle: string;
            content: string;
            storyId: string;
        }[];
    }
    title: string;
    updatedAt: string;
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ blogId: string }> }) {
    const { blogId } = await params;
    const { success, data, error } = await getBlogDetails(blogId);

    if (!success) {
        throw new Error(error);
    }

    console.log('Blog details', data);

    return <BlogDetailsClient data={data} />;
}