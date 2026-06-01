'use client';

import { createStoryForBlog } from "@/actions/blogs.actions";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

export function CreateBlogStory({ blogId }: { blogId: string }) {

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        setLoading(true);

        const result = await createStoryForBlog(blogId, formData);

        setLoading(false);
        if (!result.success) {
            toast.error("Story creation failed", {
                description: result.error ?? "Something went wrong.",
            });
        } else {
            toast.success("Story created successfully", {
                description: "The new story has been added.",
            });
            form.reset();
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                

                <Field>
                    <FieldLabel htmlFor="intro">Intro</FieldLabel>
                    <Field>
                        <FieldDescription>Write a brief introduction for the story.</FieldDescription>
                        <Textarea id="intro" name="intro" placeholder="Type your message here." />
                    </Field>
                </Field>

                <Field>
                    <FieldLabel htmlFor="conclusion">Conclusion</FieldLabel>
                    <Field>
                        <FieldDescription>Write a brief conclusion for the story.</FieldDescription>
                        <Textarea id="conclusion" name="conclusion" placeholder="Type your message here." />
                    </Field>
                </Field>

                <Field orientation="horizontal">
                    <Button type="reset" variant="outline" disabled={loading}>
                        Reset
                    </Button>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}