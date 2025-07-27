import React from 'react'
import { Doc } from '../../../convex/_generated/dataModel'
import { TableCell, TableRow } from '@/components/ui/table'
import {SiGoogledocs} from 'react-icons/si'
import { Building2Icon, CircleUserIcon, MoreVerticalIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import DocumentRowMenu from "./DocumentRowMenu";
import { useRouter } from 'next/navigation';

interface Props {
  document: Doc<"documents">,

}
export default function DocumentRow({document}:Props) {

  const router = useRouter();
  const onNewTabClick = (id: string) => {
    window.open(`/documents/${id}`, "_blank");
  }

  const onRowClick = (id: string) => {
    router.push(`/documents/${id}`);
  }

  return (
    <TableRow
      className="cursor-pointer border-gray-200"
      onClick={(e) => {
        e.stopPropagation();
        onRowClick(document._id);
      }}
    >
      <TableCell>
        <div className="flex gap-2 items-center">
          <SiGoogledocs className="size-6 fill-blue-500" />
          <span
            className="font-medium hover:text-black"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(document._id);
            }}
          >
            {document.title}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-muted-foreground hidden md:flex gap-2 items-center">
          {document.organizationId ? (
            <Building2Icon className="size-4" />
          ) : (
            <CircleUserIcon className="size-4" />
          )}
          {document.organizationId ? "Organization" : "Personal"}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-muted-foreground hidden md:table-cell">
          {format(new Date(document._creationTime), "MMM dd, yyyy")}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end">
          <DocumentRowMenu
            documentId={document._id}
            title={document.title}
            onNewTab={onNewTabClick}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
