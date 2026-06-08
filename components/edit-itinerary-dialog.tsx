'use client';

import { updateItinerary } from "@/actions/itineraries.actions";
import { type Itinerary } from "@/app/(dashboard)/tours/page";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Field,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function EditItineraryDialog({ tourId, itineraryId, itinerary }: { tourId: string, itineraryId: string, itinerary: Itinerary }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activities, setActivities] = useState<string[]>(itinerary.activities);

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

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        formData.delete("activities");

        activities.forEach(a => formData.append("activities", a));

        setLoading(true);

        const result = await updateItinerary(tourId, itineraryId, formData);

        setLoading(false);

        if (!result.success) {
            console.error('Error updating itinerary:', result.error)
            toast.error("Itinerary update failed", {
                description: result.error ?? "Something went wrong.",
            });
            setOpen(false);
        } else {
            toast.success("Itinerary updated successfully");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Update Itinerary</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit itinerary</DialogTitle>
                        <DialogDescription>
                            Update the details of this itinerary
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        {/* Title */}
                        <Field>
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input defaultValue={itinerary.title} id="title" name="title" placeholder="Tour Title"  />
                        </Field>

                        {/* Dates */}
                        <Field>
                            <FieldLabel htmlFor="day">Day</FieldLabel>
                            <Input defaultValue={itinerary.day} id="day" name="day" placeholder="e.g.,Day 1"  />
                        </Field>

                        {/* IMAGE */}
                        <Field>
                            <FieldLabel htmlFor="dayImage">Itinerary image</FieldLabel>
                            <Input id="dayImage" name="dayImage" type="file" accept="image/*"  />
                        </Field>

                        <Field>
                            <FieldLabel>Activities</FieldLabel>

                            {activities.map((value, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        defaultValue={value}
                                        onChange={(e) =>
                                            handleArrayChange(setActivities, index, e.target.value)
                                        }
                                        placeholder="Activity"                                        
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
            </DialogContent>
        </Dialog>
    );
}