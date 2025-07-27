"use client";
import React from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem } from "@tiptap/extension-list";
import { TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
// import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image"
import { useEditorStore } from "@/store/use-editor-store";
import { TextStyle, FontFamily, FontSize, LineHeight } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Ruler from "./Ruler";
import {
  useLiveblocksExtension,
} from "@liveblocks/react-tiptap";
import { Threads } from "@/app/documents/[id]/Threads";
import { useStorage } from "@liveblocks/react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/app/constants";

interface Props {
  preLoadDoc: Preloaded<typeof api.documents.getDocumentById>;
}
export default function DocEditor({ preLoadDoc }: Props) {
  const document = usePreloadedQuery(preLoadDoc!);

  const liveblocks = useLiveblocksExtension({
    initialContent: document!.initialContent,
  });
  
  const { setEditor } = useEditorStore();
  const leftMargin = useStorage((root) => root.leftMargin) || LEFT_MARGIN_DEFAULT;
  const rightMargin = useStorage((root) => root.rightMargin) || RIGHT_MARGIN_DEFAULT;

  const editor = useEditor({
    onCreate(props) {
      setEditor(props.editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate(props) {
      setEditor(props.editor);
    },
    onSelectionUpdate(props) {
      setEditor(props.editor);
    },
    onTransaction(props) {
      setEditor(props.editor);
    },
    onFocus(props) {
      setEditor(props.editor);
    },
    onBlur(props) {
      setEditor(props.editor);
    },
    onContentError(props) {
      setEditor(props.editor);
    },
    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10  pb-10 cursor-text",
      },
    },
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      TaskItem.configure({
        nested: true,
      }),
      TaskList,
      TableKit.configure({
        table: { resizable: true },
      }),
      ImageResize.configure({
        allowBase64: true,
      }),
      liveblocks,
      TextStyle,
      FontFamily,
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontSize,
      LineHeight,
    ],
    content: `Hello World!`,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });


  if (!editor) {
    return (
      <div className="size-full overflow-x-auto bg-[#f9faff] px-4 print:p-0 print:bg-white print:overflow-visible">
        <Ruler />
        <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
          <div className="focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pb-10">
            Loading editor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full overflow-x-auto bg-[#f9faff] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>
    </div>
  );
}
