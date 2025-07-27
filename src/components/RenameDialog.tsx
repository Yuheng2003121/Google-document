"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Form } from './ui/form';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

interface Props {
  documentId: Id<"documents">;
  initialTitle: string;
  children: React.ReactNode;
}
export default function RenameDialog({ documentId, children, initialTitle }: Props) {
  const update = useMutation(api.documents.updateDocumentById)
  const [isUpdating, setIsUpdating] = useState(false)
  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);


  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await update({ documentId, title:title.trim() });
      toast.success("Document updated successfully.");
      setOpen(false);
    } catch(error) {
      if(error instanceof ConvexError) {
        toast.error(error.data)
      }
    }
    finally {
      setIsUpdating(false);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <DialogHeader>
              <DialogTitle>Rename document</DialogTitle>
              <DialogDescription>
                Enter a new name for the document
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Docs name"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <DialogFooter>
              <Button
                className="cursor-pointer"
                type="button"
                variant={"ghost"}
                disabled={isUpdating}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              >
                Cancle
              </Button>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isUpdating}
                onClick={(e) => e.stopPropagation()}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
