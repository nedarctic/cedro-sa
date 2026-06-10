'use client';

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreateNewItineraryDialog({tourId}: {tourId: string}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [activities, setActivities] = useState<string[]>([""]);

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

        formData.delete("activities");

        activities.forEach(a => formData.append("activities", a));

        setLoading(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BFF_API}/api/itineraries/${tourId}`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        setLoading(false);

        if (!res.ok) {
            console.error('Error creating itinerary:', res)
            toast.error("Itinerary creation failed", {
                description: res.statusText ?? "Something went wrong.",
            });
        } else {
            toast.success("Itinerary created successfully");
            form.reset();
            router.refresh();
            setActivities([""]);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="py-3 font-black">Create new itinerary</h1>
            <FieldGroup>
                {/* Title */}
                <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input id="title" name="title" placeholder="Tour Title" required />
                </Field>

                {/* Dates */}
                <Field>
                    <FieldLabel htmlFor="day">Day</FieldLabel>
                    <Input id="day" name="day" placeholder="e.g.,Day 1" required />
                </Field>

                {/* IMAGE */}
                <Field>
                    <FieldLabel htmlFor="dayImage">Itinerary image</FieldLabel>
                    <Input id="dayImage" name="dayImage" type="file" accept="image/*" required />
                </Field>

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