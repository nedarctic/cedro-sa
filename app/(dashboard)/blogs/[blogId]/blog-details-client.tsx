'use client'

import Image from "next/image";
import { BreadCrumb } from "@/components/breadcrumb";
import { type BlogDetails } from "./page";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { AddNewStorySectionDialog } from "@/components/add-new-story-section-dialog";
import UpdateBlogStorySectionDialog from "@/components/update-blog-story-section-dialog";
import { DeleteBlogStorySectionDialog } from "@/components/delete-blog-story-section-dialog";

export function BlogDetailsClient({ data }: { data: BlogDetails }) {

    const crumbs = [
        {
            label: "Blogs",
            link: "/blogs",
        },
    ];

    return (
        <div>
            <BreadCrumb crumbs={crumbs} page={"Blog Details"} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="p-6 w-full space-y-6">

                        <h1 className="font-extrabold text-xl">
                            {data.title}
                        </h1>

                        <div className="flex flex-col gap-8 items-start">

                            {/* IMAGE */}

                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                                <Image
                                    src={data.blogImage}
                                    alt={data.title}
                                    fill
                                    className="object-cover"
                                />

                            </div>

                            {/* DETAILS */}
                            <div className="flex flex-col gap-6 text-sm w-full max-w-3xl">

                                <div className="flex flex-col gap-4">

                                    <div>
                                        <p className="text-muted-foreground">
                                            Published Date
                                        </p>
                                        <p>
                                            {new Date(data.date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Excerpt
                                        </p>
                                        <p className="leading-relaxed">
                                            {data.excerpt}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Created At
                                        </p>
                                        <p>
                                            {new Date(data.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Last Updated
                                        </p>
                                        <p>
                                            {new Date(data.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Blog ID
                                        </p>
                                        <p className="font-mono text-xs break-all">
                                            {data.id}
                                        </p>
                                    </div>
                                </div>

                                {/* STORY */}
                                <div className="border-t pt-6">

                                    <h2 className="font-semibold text-base mb-4">
                                        Story
                                    </h2>

                                    {data.story ? (
                                        <div className="space-y-6">

                                            <div>
                                                <p className="text-muted-foreground mb-2">
                                                    Introduction
                                                </p>

                                                <p className="leading-relaxed whitespace-pre-wrap">
                                                    {data.story.intro}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground mb-2">
                                                    Conclusion
                                                </p>

                                                <p className="leading-relaxed whitespace-pre-wrap">
                                                    {data.story.conclusion}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">
                                                    Story ID
                                                </p>

                                                <p className="font-mono text-xs break-all">
                                                    {data.story.id}
                                                </p>
                                            </div>

                                            {data.story.sections && data.story.sections.length > 0 ? (
                                                <div className="space-y-4">
                                                    <h3 className="font-semibold text-base mb-4">
                                                        Sections
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {data.story.sections.map((section) => (
                                                            <div key={section.id} className="border rounded-lg p-4 space-y-3">
                                                                <div className="flex flex-col gap-2">
                                                                    <h4 className="font-medium text-lg mb-2">
                                                                        {section.subtitle}
                                                                    </h4>

                                                                    <p className="leading-relaxed whitespace-pre-wrap">
                                                                        {section.content}
                                                                    </p>
                                                                </div>

                                                                <div className="flex gap-2 justify-end">
                                                                    <UpdateBlogStorySectionDialog
                                                                        storyId={data.story?.id!}
                                                                        sectionId={section.id}
                                                                        subtitle={section.subtitle}
                                                                        content={section.content}
                                                                    />
                                                                    <DeleteBlogStorySectionDialog
                                                                        storyId={data.story?.id!}
                                                                        sectionId={section.id}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <AddNewStorySectionDialog blogId={data.story.id} />
                                                </div>
                                            ) : (
                                                <div className="flex gap-4 items-center justify-start">
                                                    <p className="text-muted-foreground">
                                                        No sections available.
                                                    </p>
                                                    <AddNewStorySectionDialog blogId={data.story.id} />
                                                </div>

                                            )}

                                        </div>
                                    ) : (
                                        <div className="flex gap-4 items-center justify-start">
                                            <p className="text-muted-foreground">
                                                No story has been added for this blog yet.
                                            </p>
                                            <Link href={`/blogs/${data.id}/create-story`} className="flex bg-black rounded-lg p-2 text-white text-sm items-center justify-center gap-3">Create new story<PlusIcon color="white" size={16} /></Link>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}