import { updateBlogStorySection } from "@/actions/blogs.actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function UpdateBlogStorySectionDialog({
    storyId,
    sectionId,
    subtitle,
    content,
}: {
    storyId: string;
    sectionId: string;
    subtitle: string;
    content: string;
}) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdateSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        setLoading(true);

        const result = await updateBlogStorySection(storyId, sectionId, formData);

        setLoading(false);

        if (result.success) {
            toast.success("Section updated successfully", {
                description: "The story section has been updated.",
            });
            setOpen(false);
        } else {
            toast.error("Failed to update section", {
                description: result.error ?? "Something went wrong.",
            });
        }   
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Update Section</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleUpdateSection}>
                    <DialogHeader>
                        <DialogTitle>Update Story Section</DialogTitle>
                        <DialogDescription>
                            Update the details for the story section.
                        </DialogDescription>
                    </DialogHeader>

                    {/* SCROLLABLE AREA */}
                    <div className="-mx-4 max-h-[60vh] overflow-y-auto px-4 py-4 space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="subtitle">Subtitle</FieldLabel>
                                <Input
                                    id="subtitle"
                                    name="subtitle"
                                    placeholder="Section Subtitle"
                                    defaultValue={subtitle}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="content">Content</FieldLabel>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="Section Content"
                                    className="min-h-35"
                                    defaultValue={content}
                                />
                            </Field>
                        </FieldGroup>
                    </div>

                    <DialogFooter>
                        <Button type="reset" variant="outline" disabled={loading}>
                            Reset
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Section"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}