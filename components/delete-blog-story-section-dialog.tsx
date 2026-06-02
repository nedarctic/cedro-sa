"use client";

import { deleteBlogStorySection } from "@/actions/blogs.actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function DeleteBlogStorySectionDialog({ storyId, sectionId }: { storyId: string; sectionId: string }) {

    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {

        setLoading(true);

        const result = await deleteBlogStorySection(storyId, sectionId);

        setLoading(false);

        if (result.success) {
            toast.success("Section deleted successfully", {
                description: "The story section has been deleted.",
            });
            setOpen(false);
            router.refresh();
        } else {
            toast.error("Failed to delete section", {
                description: result.error ?? "Something went wrong.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    Remove Section
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete story section?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. The section will be permanently removed.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Yes, delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}