'use client';

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { createTour } from "@/actions/tours.actions";
import { useState } from "react";
import { toast } from "sonner";

export function CreateNewTourComponent() {
    const [loading, setLoading] = useState(false);

    const [activities, setActivities] = useState<string[]>([""]);
    const [included, setIncluded] = useState<string[]>([""]);
    const [excluded, setExcluded] = useState<string[]>([""]);

    const handleArrayChange = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string
    ) => {
        setter(prev => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    const addField = (
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setter(prev => [...prev, ""]);
    };

    const removeField = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number
    ) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        // override arrays from state
        formData.delete("activities");
        formData.delete("included");
        formData.delete("excluded");

        activities.forEach(a => formData.append("activities", a));
        included.forEach(i => formData.append("included", i));
        excluded.forEach(e => formData.append("excluded", e));

        setLoading(true);

        const result = await createTour(formData);

        setLoading(false);

        if (!result.success) {
            toast.error("Tour creation failed", {
                description: result.error ?? "Something went wrong.",
            });
        } else {
            toast.success("Tour created successfully");
            form.reset();

            setActivities([""]);
            setIncluded([""]);
            setExcluded([""]);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                {/* Title */}
                <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input id="title" name="title" placeholder="Tour Title" required />
                </Field>

                {/* Dates */}
                <Field>
                    <FieldLabel htmlFor="dates">Dates</FieldLabel>
                    <Input id="dates" name="dates" placeholder="Anytime" required />
                </Field>

                {/* Group Size */}
                <Field>
                    <FieldLabel htmlFor="groupSize">Group Size</FieldLabel>
                    <Input id="groupSize" name="groupSize" placeholder="Max 16 people" required />
                </Field>

                {/* Price */}
                <Field>
                    <FieldLabel htmlFor="price">Price</FieldLabel>
                    <Input id="price" name="price" placeholder="From: USD $1,059.00" required />
                </Field>

                {/* Duration */}
                <Field>
                    <FieldLabel htmlFor="duration">Duration</FieldLabel>
                    <Input id="duration" name="duration" placeholder="3 Days / 2 Nights" required />
                </Field>

                {/* Intro */}
                <Field>
                    <FieldLabel htmlFor="intro">Introduction</FieldLabel>
                    <FieldDescription>
                        Write a short description about the tour.
                    </FieldDescription>
                    <Textarea id="intro" name="intro" required />
                </Field>

                {/* IMAGE */}
                <Field>
                    <FieldLabel htmlFor="image">Tour image</FieldLabel>
                    <Input id="image" name="image" type="file" accept="image/*" required />
                </Field>

                {/* ========================= */}
                {/* ACTIVITIES */}
                {/* ========================= */}
                <Field>
                    <FieldLabel>Activities</FieldLabel>

                    {activities.map((value, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <Input
                                value={value}
                                onChange={(e) =>
                                    handleArrayChange(setActivities, index, e.target.value)
                                }
                                placeholder="Activity"
                                required
                            />

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => removeField(setActivities, index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}

                    <Button type="button" onClick={() => addField(setActivities)}>
                        Add Activity
                    </Button>
                </Field>

                {/* ========================= */}
                {/* INCLUDED */}
                {/* ========================= */}
                <Field>
                    <FieldLabel>Included</FieldLabel>

                    {included.map((value, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <Input
                                value={value}
                                onChange={(e) =>
                                    handleArrayChange(setIncluded, index, e.target.value)
                                }
                                placeholder="Included item"
                                required
                            />

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => removeField(setIncluded, index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}

                    <Button type="button" onClick={() => addField(setIncluded)}>
                        Add Included Item
                    </Button>
                </Field>

                {/* ========================= */}
                {/* EXCLUDED */}
                {/* ========================= */}
                <Field>
                    <FieldLabel>Excluded</FieldLabel>

                    {excluded.map((value, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <Input
                                value={value}
                                onChange={(e) =>
                                    handleArrayChange(setExcluded, index, e.target.value)
                                }
                                placeholder="Excluded item"
                                required
                            />

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => removeField(setExcluded, index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}

                    <Button type="button" onClick={() => addField(setExcluded)}>
                        Add Excluded Item
                    </Button>
                </Field>

                {/* Submit */}
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