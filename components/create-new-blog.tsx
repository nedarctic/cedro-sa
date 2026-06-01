'use client';

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createBlog } from "@/actions/blogs.actions";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

export function CreateNewBlogComponent() {

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        setLoading(true);

        const result = await createBlog(formData);

        setLoading(false);
        if (!result.success) {
            toast.error("Blog creation failed", {
                description: result.error ?? "Something went wrong.",
            });
        } else {
            toast.success("Blog created successfully", {
                description: "The new blog has been added.",
            });
            form.reset();
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input id="title" name="title" placeholder="Blog Title" />
                </Field>

                <Field>
                    <FieldLabel htmlFor="date">Date</FieldLabel>
                    <Input
                        id="date"
                        name="date"
                        type="date"
                        placeholder="2026-05-01"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
                    <Field>
                        <FieldDescription>Enter a short excerpt for the blog post.</FieldDescription>
                        <Textarea id="excerpt" name="excerpt" maxLength={200} placeholder="Write short excerpt here" />
                    </Field>
                </Field>

                <Field>
                    <FieldLabel htmlFor="image">Blog Image</FieldLabel>
                    <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/png, image/jpeg"
                    />
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