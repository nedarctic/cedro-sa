'use client';

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addTeamMember } from "@/actions/team.actions";
import { useState } from "react";

export function CreateTeamMemberInputGroup() {

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        setLoading(true);

        const result = await addTeamMember(formData);

        setLoading(false);
        if (!result.success) {            
            console.error(result.error);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input id="name" name="name" placeholder="Jordan Lee" />
                </Field>

                <Field>
                    <FieldLabel htmlFor="designation">Designation</FieldLabel>
                    <Input
                        id="designation"
                        name="designation"
                        type="text"
                        placeholder="Operations Officer"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Input
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Short description..."
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="image">Profile Picture</FieldLabel>
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