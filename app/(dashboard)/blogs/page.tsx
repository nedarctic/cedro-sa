import BlogClient from "./blog-client";
import { getBlogs } from "@/actions/blogs.actions";

export default async function BlogPage() {
  
  const { data } = await getBlogs();
  const initialData: any[] = data || [];

  return <BlogClient initialData={initialData} />;
}