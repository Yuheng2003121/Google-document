"use client"
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from "sonner";
import { ConvexError } from 'convex/values';
import { useRouter } from 'next/navigation';


interface Props {
  documentId: Id<"documents">;
  children: React.ReactNode;
}
export default function RemoveDialog({ documentId, children }: Props) {
  const remove = useMutation(api.documents.deleteDocumentById)
  const [isDeleting, setIsDeleting] = useState(false)
  // const { toast } = useToast();
  const router = useRouter();

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      await remove({ documentId });
      toast.success("Document removed")
      window.location.href = "/";
    } catch(error) {
      let errorMsg;
      if(error instanceof ConvexError) {
        errorMsg = error.data;
      } else {
        errorMsg = "An error occurred. Please try again later.";
      }
      
      toast.error(errorMsg);

    }
    finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={handleRemove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
