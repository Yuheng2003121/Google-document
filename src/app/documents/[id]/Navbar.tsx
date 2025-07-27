"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import DocumentInput from "./DocumentInput";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  Menu,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Avatars } from "./Avatars";
import { Inbox } from "./Inbox";
import { Separator } from "@/components/ui/separator";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import RemoveDialog from "@/components/RemoveDialog";
import RenameDialog from "@/components/RenameDialog";

const TableGridSelector = () => {
  const {editor} = useEditorStore();
  const [selectedCells, setSelectedCells] = useState({ rows: 0, cols: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (row: number, col: number) => {
    setIsDragging(true);
    setSelectedCells({ rows: row, cols: col });
  };

  const insertTable = () => {
    const { rows, cols } = selectedCells;
    editor?.chain().focus().insertTable({ rows, cols }).run();
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      setSelectedCells({
        rows: Math.max(1, row),
        cols: Math.max(1, col),
      });
    }
  };

  const endDrag = () => {
    setIsDragging(false);
    if (selectedCells.rows > 0 && selectedCells.cols > 0) {
      // 实际创建表格的逻辑
    }
  };

  return (
    <div className="py-3 px-4" onMouseLeave={endDrag} onMouseUp={endDrag}>
      {/* 表格网格 - Flexbox 实现 */}
      <div className="flex flex-col gap-2 mb-2">
        {[...Array(5)].map((_, row) => (
          <div key={row} className="flex gap-2">
            {[...Array(5)].map((_, col) => (
              <div
                key={`${row}-${col}`}
                className={`w-6 h-6 border rounded-sm transition-colors cursor-pointer flex-shrink-0 ${
                  row < selectedCells.rows && col < selectedCells.cols
                    ? "bg-blue-500 border-blue-600"
                    : "bg-white border-gray-300 hover:bg-blue-100"
                }`}
                onMouseDown={() => startDrag(row + 1, col + 1)}
                onMouseEnter={() => handleMouseEnter(row + 1, col + 1)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 底部提示文字 */}
      <div className="text-xs text-gray-500 text-center">
        {isDragging
          ? `已选择 ${selectedCells.rows} × ${selectedCells.cols}`
          : "拖动选择表格大小"}
      </div>

      <div className="flex justify-center">
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm mt-2" onClick={insertTable}>
          创建
        </button>
      </div>
    </div>
  );
};

export default function Navbar({documentId}: {documentId: Id<"documents">}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const {editor} = useEditorStore();
  const router = useRouter();

  const documentInfo = useQuery(api.documents.getDocumentById, { id: documentId });

  const mutation = useMutation(api.documents.addDocument)

  const onNewDocument = async () => {
     try {
      const newDocId = await mutation({ title: "Untitled document", initialContent: "" });
      toast.success("Document created successfully");
      router.push(`/documents/${newDocId}`)
     } catch (error) {
      toast.error(error instanceof ConvexError ? error.data : "Something went wrong")
     }
  }

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  } 

  const onSaveJson = () => {
    if(!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {type: "application/json"})
    onDownload(blob, "document.json");
  }

  const onSaveHtml = () => { 
    if(!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], {type: "text/html"})
    onDownload(blob, "document.html");
  }

  const onSaveText = () => {
    if(!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], {type: "text/plain"})
    onDownload(blob, "document.txt");
  }

  return (
    <nav className="flex justify-between items-center">
      <div className="flex items-center gap-4 px-2 py-1">
        <Link href="/" className="shrink-0">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={40}
            height={40}
            className="hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="flex-1 flex flex-col">
          <DocumentInput document={documentInfo!} />
          <Menubar className="border-none bg-transparent shadow-none h-auto">
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-1 px-2 rounded-sm hover:bg-muted">
                File
              </MenubarTrigger>
              <MenubarContent
                className="min-w-[200px] border-gray-200 shadow-lg"
                onInteractOutside={() => setActiveMenu(null)}
              >
                <MenubarSub>
                  <MenubarSubTrigger className="flex gap-2 items-center">
                    <FileIcon className="size-4" />
                    Save
                  </MenubarSubTrigger>
                  <MenubarSubContent className="border-gray-200">
                    <MenubarItem
                      className="flex gap-2 items-center"
                      onClick={onSaveJson}
                    >
                      <FileJsonIcon className="size-4" />
                      JSON
                    </MenubarItem>
                    <MenubarItem
                      className="flex gap-2 items-center"
                      onClick={onSaveHtml}
                    >
                      <GlobeIcon className="size-4" />
                      HTML
                    </MenubarItem>
                    <MenubarItem
                      className="flex gap-2 items-center"
                      onClick={() => window.print()}
                    >
                      <BsFilePdf className="size-4" />
                      PDF
                    </MenubarItem>
                    <MenubarItem
                      className="flex gap-2 items-center"
                      onClick={onSaveText}
                    >
                      <FileTextIcon className="size-4" />
                      Text
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>

                <MenubarItem
                  className="flex gap-2 items-center"
                  onClick={onNewDocument}
                >
                  <FilePlusIcon className="size-4" />
                  New Document
                </MenubarItem>

                <MenubarSeparator className="bg-gray-100" />

                <RenameDialog
                  documentId={documentId}
                  initialTitle={documentInfo?.initialContent || ""}
                >
                  <MenubarItem
                    className="flex gap-2 items-center"
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <FilePenIcon className="size-4" />
                    Rename
                  </MenubarItem>
                </RenameDialog>

                <RemoveDialog documentId={documentId}>
                  <MenubarItem
                    className="flex gap-2 items-center text-red-600 hover:bg-red-50"
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <TrashIcon className="size-4" />
                    Remove
                  </MenubarItem>
                </RemoveDialog>

                <MenubarSeparator className="bg-gray-100" />

                <MenubarItem
                  className="flex gap-2 items-center"
                  onClick={() => window.print()}
                >
                  <PrinterIcon className="size-4" />
                  Print
                  <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-1 px-2 rounded-sm hover:bg-muted">
                Edit
              </MenubarTrigger>
              <MenubarContent
                className="min-w-[120px] border-gray-200 shadow-lg"
                onInteractOutside={() => setActiveMenu(null)}
              >
                <MenubarItem
                  className="flex gap-2 items-center"
                  onClick={() => editor?.commands.undo()}
                >
                  <Undo2Icon className="size-4" />
                  Undo
                  <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem
                  className="flex gap-2 items-center"
                  onClick={() => editor?.commands.redo()}
                >
                  <Redo2Icon className="size-4" />
                  Redo
                  <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-1 px-2 rounded-sm hover:bg-muted">
                Insert
              </MenubarTrigger>
              <MenubarContent
                className="border-gray-200 shadow-lg"
                onInteractOutside={() => setActiveMenu(null)}
              >
                <MenubarSub>
                  <MenubarSubTrigger>Table</MenubarSubTrigger>
                  <MenubarSubContent className="border-gray-200 p-0 overflow-hidden">
                    <TableGridSelector />
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-1 px-2 rounded-sm hover:bg-muted">
                Format
              </MenubarTrigger>
              <MenubarContent className="border-gray-200 shadow-lg">
                <MenubarSub>
                  <MenubarSubTrigger>
                    <TextIcon className="size-4 mr-2" />
                    Text
                  </MenubarSubTrigger>
                  <MenubarSubContent className="border-gray-200">
                    <MenubarItem onClick={() => editor?.commands.toggleBold()}>
                      <BoldIcon className="size-4 mr-2" />
                      Bold <MenubarShortcut>⌘B</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                      onClick={() => editor?.commands.toggleItalic()}
                    >
                      <ItalicIcon className="size-4 mr-2" />
                      Italic
                    </MenubarItem>
                    <MenubarItem
                    // onClick={() => editor?.commands.toggleUnderline()}
                    >
                      <UnderlineIcon className="size-4 mr-2" />
                      Underline <MenubarShortcut>⌘I</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                      onClick={() => editor?.commands.toggleStrike()}
                    >
                      <StrikethroughIcon className="size-4 mr-2" />
                      Strikethrough <MenubarShortcut>⌘S</MenubarShortcut>
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem onClick={() => editor?.commands.unsetAllMarks()}>
                  <RemoveFormattingIcon className="size-4 mr-2" />
                  Clear formatting
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      <div className="flex  gap-4 items-center ">
        <Avatars />
        <Separator orientation="vertical" className="!h-6 text-gray-500" />
        <Inbox />
        <Separator orientation="vertical" className="!h-6 text-gray-500" />
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectPersonalUrl="/"
          afterSelectOrganizationUrl="/"
        />
        <UserButton />
      </div>
    </nav>
  );
}
