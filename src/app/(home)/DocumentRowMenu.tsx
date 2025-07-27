import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, FilePenIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RemoveDialog from "@/components/RemoveDialog";
import { Id } from "../../../convex/_generated/dataModel";
import RenameDialog from "@/components/RenameDialog";

interface Props {
  documentId: Id<"documents">;
  title: string;
  onNewTab?: (id: string) => void;
}
export default function DocumentRowMenu({ documentId, title, onNewTab }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="rounded-full">
          <MoreVerticalIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border-gray-300"
      >
        <RemoveDialog documentId={documentId}>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            onSelect={(e) => e.preventDefault()} // 阻止菜单自动关闭
          >
            <TrashIcon className="size-4 mr-1" />
            Delete
          </DropdownMenuItem>
        </RemoveDialog>
        <RenameDialog documentId={documentId} initialTitle={title}>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            onSelect={(e) => e.preventDefault()} // 阻止菜单自动关闭
          >
            <FilePenIcon className="size-4 mr-1" />
            Rename
          </DropdownMenuItem>
        </RenameDialog>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onNewTab?.(documentId);
          }}
        >
          <ExternalLinkIcon className="size-4 mr-1" />
          Open in a new tab
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
