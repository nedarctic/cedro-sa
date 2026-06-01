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

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateTeamMember } from "@/actions/team.actions";

export function EditTeamMemberDialog({ member }: { member: any }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateTeamMember(member.id, formData);

      if (res.success) {
        setOpen(false);
      } else {
        console.error(res.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Member</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update the details of this team member.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-4 py-4">
            <Field>
              <Input
                name="name"
                defaultValue={member.name}
                placeholder="Name"
              />
            </Field>

            <Field>
              <Input
                name="designation"
                defaultValue={member.designation}
                placeholder="Designation"
              />
            </Field>

            <Field>
              <Input
                name="description"
                defaultValue={member.description}
                placeholder="Description"
              />
            </Field>

            <Field>
              <Input
                type="file"
                name="image"
                accept="image/png, image/jpeg"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}