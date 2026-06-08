import BlogClient from "./blog-client";
import { getBlogs } from "@/lib/helpers/blogs.helpers";

export default async function BlogPage() {
  
  const { data } = await getBlogs();
  const initialData: any[] = data || [];

  return <BlogClient initialData={initialData} />;
}