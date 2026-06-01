import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { addSectionToStory } from "@/actions/blogs.actions";

export function AddNewStorySectionDialog({ blogId }: { blogId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreateSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        setLoading(true);

        const result = await addSectionToStory(blogId, formData);

        setLoading(false);

        if (result.success) {
            toast.success("Section added successfully", {
                description: "The new section has been added to the story.",
            });
            setOpen(false);
        } else {
            toast.error("Failed to add section", {
                description: result.error ?? "Something went wrong.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add New Section</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleCreateSection}>
                    <DialogHeader>
                        <DialogTitle>Add New Story Section</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new story section.
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
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="content">Content</FieldLabel>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="Section Content"
                                    className="min-h-[140px]"
                                />
                            </Field>
                        </FieldGroup>
                    </div>

                    <DialogFooter>
                        <Button type="reset" variant="outline" disabled={loading}>
                            Reset
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Section"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}