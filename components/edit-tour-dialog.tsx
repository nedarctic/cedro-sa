'use client';

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { Tour } from "@/app/(dashboard)/tours/page";

export function UpdateTourDialog({ tour }: { tour: Tour }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [activities, setActivities] = useState<string[]>(
        tour.activities.length ? tour.activities : [""]
    );

    const [included, setIncluded] = useState<string[]>(
        tour.included.length ? tour.included : [""]
    );

    const [excluded, setExcluded] = useState<string[]>(
        tour.excluded.length ? tour.excluded : [""]
    );

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

    const addField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, ""]);
    };

    const removeField = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number
    ) => {
        setter(prev => {
            const next = prev.filter((_, i) => i !== index);
            return next.length ? next : [""];
        });
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        formData.delete("activities");
        formData.delete("included");
        formData.delete("excluded");

        activities.filter(Boolean).forEach(v =>
            formData.append("activities", v)
        );

        included.filter(Boolean).forEach(v =>
            formData.append("included", v)
        );

        excluded.filter(Boolean).forEach(v =>
            formData.append("excluded", v)
        );

        setLoading(true);

        const result = await fetch(`${process.env.NEXT_PUBLIC_BFF_API}/api/tours/${tour.id}`, {
            method: 'PATCH',
            body: formData,
            credentials: 'include',
        });

        setLoading(false);

        if (!result.ok) {
            toast.error("Tour update failed", {
                description: result.statusText ?? "Something went wrong.",
            });
            return;
        }

        toast.success("Tour updated successfully");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Tour</Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Edit Tour</DialogTitle>
                    <DialogDescription>
                        Update the details of this tour.
                    </DialogDescription>
                </DialogHeader>


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-hidden"
                >
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {/* ================= GENERAL ================= */}
                        <FieldGroup>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <Input name="title" defaultValue={tour.title} />
                                </Field>

                                <Field>
                                    <FieldLabel>Dates</FieldLabel>
                                    <Input name="dates" defaultValue={tour.dates} />
                                </Field>

                                <Field>
                                    <FieldLabel>Duration</FieldLabel>
                                    <Input name="duration" defaultValue={tour.duration} />
                                </Field>

                                <Field>
                                    <FieldLabel>Group Size</FieldLabel>
                                    <Input name="groupSize" defaultValue={tour.groupSize} />
                                </Field>

                                <Field>
                                    <FieldLabel>Price</FieldLabel>
                                    <Input name="price" defaultValue={tour.price} />
                                </Field>

                                <Field>
                                    <FieldLabel>Image</FieldLabel>
                                    <Input name="image" type="file" accept="image/*" />
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel>Introduction</FieldLabel>
                                <Textarea
                                    name="intro"
                                    defaultValue={tour.intro}
                                    rows={6}
                                />
                            </Field>
                        </FieldGroup>

                        {/* ================= ACTIVITIES ================= */}
                        <FieldGroup>
                            <FieldLabel>Activities</FieldLabel>

                            {activities.map((value, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        value={value}
                                        onChange={(e) =>
                                            handleArrayChange(setActivities, index, e.target.value)
                                        }
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
                        </FieldGroup>

                        {/* ================= INCLUDED ================= */}
                        <FieldGroup>
                            <FieldLabel>Included</FieldLabel>

                            {included.map((value, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        value={value}
                                        onChange={(e) =>
                                            handleArrayChange(setIncluded, index, e.target.value)
                                        }
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
                        </FieldGroup>

                        {/* ================= EXCLUDED ================= */}
                        <FieldGroup>
                            <FieldLabel>Excluded</FieldLabel>

                            {excluded.map((value, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        value={value}
                                        onChange={(e) =>
                                            handleArrayChange(setExcluded, index, e.target.value)
                                        }
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
                        </FieldGroup>
                    </div>

                    {/* fixed footer */}
                    <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Tour"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}