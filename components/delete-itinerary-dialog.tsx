"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteItinerary } from "@/actions/itineraries.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteItineraryDialog({ itineraryId }: { itineraryId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteItinerary(itineraryId);

      if (res.success) {
        setOpen(false);
        toast.success('Itinerary deleted successfully')
        router.refresh();
      } else {
        toast.error("Itinerary was not deleted.", {
            description: res.error ?? "Something went wrong"
        } )
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          Remove Itinerary
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete itinerary?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The itinerary will be permanently removed.
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
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Yes, delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}