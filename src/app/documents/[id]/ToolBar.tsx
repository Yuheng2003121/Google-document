"use client";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BoldIcon,
  ChevronDownIcon,
  HighlighterIcon,
  Icon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListCollapseIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SearchIcon,
  SpellCheckIcon,
  UnderlineIcon,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Level } from "@/app/types";
import { CirclePicker, ColorResult } from "react-color";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";


// 保存选中的文字样式
// const restoreSelection = (editor: Editor) => {
//   if (!editor) return;

//   // 保存当前选区
//   const { from, to } = editor.state.selection;

//   // 恢复选区
//   editor.commands.setTextSelection({ from, to });
// };


interface ToolBarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon?: LucideIcon;
}
const ToolBarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolBarButtonProps) => {
  // const {editor} = useEditorStore();
  return (
    <button
      onClick={() => {
        // restoreSelection(editor!);
        onClick?.();
      }}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-md hover:bg-neutral-200/80 cursor-pointer ",
        isActive ? "bg-neutral-200/80" : ""
      )}
    >
      {Icon && <Icon className="size-4" />}
    </button>
  );
};

const FontFamilyButton = () => {
  const { editor } = useEditorStore();
  const fonts = [
    {
      label: "Arial",
      value: "Arial",
    },
    {
      label: "Times New Roman",
      value: "Times New Roman",
    },
    {
      label: "Courier New",
      value: "Courier New",
    },
    {
      label: "Verdana",
      value: "Verdana",
    },
    {
      label: "Georgia",
      value: "Georgia",
    },
    {
      label: "Tahoma",
      value: "Tahoma",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 w-[120px] flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
          )}
        >
          <span className="truncate">
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDownIcon className="size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-1 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white">
        {fonts.map(({ label, value }) => (
          <button
            key={value}
            style={{ fontFamily: value }}
            className={cn(
              "flex items-center px-2 py-1 rounded-sm hover:bg-neutral-200/80 ",
              editor?.getAttributes("textStyle").fontFamily === value &&
                "bg-neutral-200/80"
            )}
            onClick={() => {
              editor?.commands.setFontFamily(value);
            }}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();
  const headings = [
    {
      label: "Normal text",
      value: 0,
      fontSize: "16px",
    },
    {
      label: "Heading 1",
      value: 1,
      fontSize: "32px",
    },
    {
      label: "Heading 2",
      value: 2,
      fontSize: "24px",
    },
    {
      label: "Heading 3",
      value: 3,
      fontSize: "20px",
    },
    {
      label: "Heading 4",
      value: 4,
      fontSize: "18px",
    },
    {
      label: "Heading 5",
      value: 5,
      fontSize: "16px",
    },
  ];

  const getCurrentHeading = () => {
    const currentHeading = headings.find((heading) =>
      editor?.isActive("heading", { level: heading.value })
    );
    return currentHeading ? currentHeading.label : "Normal text";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
          )}
        >
          <span className="truncate">
            {getCurrentHeading() || "Normal Text"}
          </span>
          <ChevronDownIcon className="size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-1 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white">
        {headings.map(({ label, value, fontSize }) => (
          <button
            key={value}
            className={cn(
              "flex items-center px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              (value === 0 && !editor?.isActive("heading")) ||
                (value !== 0 && editor?.isActive("heading", { level: value }))
                ? "bg-neutral-200/80"
                : ""
            )}
            onClick={() => {
              if (value === 0) {
                editor?.commands.toggleHeading({ level: 6 });
              } else {
                editor?.commands.toggleHeading({ level: value as Level });
              }
            }}
          >
            <span className="text-sm" style={{ fontSize }}>
              {label}
            </span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();
  const currentColor = editor?.getAttributes("textStyle").color || "#000000";
  const onChange = (color: ColorResult) => {
    editor?.commands.setColor(color.hex);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
          )}
        >
          <span className="text-xs">A</span>
          <div
            className="h-0.5 w-full"
            style={{ backgroundColor: currentColor }}
          ></div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white">
        <CirclePicker color={currentColor} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HighLightColorButton = () => {
  const { editor } = useEditorStore();
  const currentColor = editor?.getAttributes("highlight").color || "#000000";
  // const currentColor = editor?.getAttributes("highlight").color || "#000000";
  const onChange = (color: ColorResult) => {
    editor?.commands.toggleHighlight({ color: color.hex });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
            editor?.isActive("highlight") ? "bg-neutral-200/80" : ""
          )}
        >
          <div className="flex flex-col justify-center items-center">
            <HighlighterIcon className="size-4" />
            <div
              className="h-0.5 w-full"
              style={{ backgroundColor: currentColor }}
            ></div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white">
        <CirclePicker color={currentColor} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkeButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState(editor?.getAttributes("link").href || "");

  // 监听编辑器选中变化
  useEffect(() => {
    if (editor) {
      // 获取当前选中文本的链接属性
      const href = editor.getAttributes("link").href || "";
      setValue(href);
    }
  }, [editor?.state.selection, editor]); // 当选区变化时触发

  const onClick = () => {
    editor?.commands.toggleLink({ href: value, target: "_blank" });
    setValue("");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
            editor?.isActive("highlight") ? "bg-neutral-200/80" : ""
          )}
        >
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white flex gap-3 ">
        <Input
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={onClick}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const onClick = (src: string) => {
    editor?.commands.setImage({ src });
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onClick(imageUrl);
      }
    };
    input.click(); // 触发文件选择对话框
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onClick(imageUrl);
      setImageUrl("");
      setIsDialogOpen(false);
    }
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
              editor?.isActive("highlight") ? "bg-neutral-200/80" : ""
            )}
          >
            <ImageIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white flex flex-col gap-3 ">
          <DropdownMenuItem
            onClick={onUpload}
            className="flex gap-3 items-center cursor-pointer rounded-md px-1 py-1 hover:border-0 hover:bg-neutral-200/80"
          >
            <UploadIcon className="size-4" />
            <span>upload</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDialogOpen(true)}
            className="flex gap-3 items-center cursor-pointer rounded-md px-1 py-1 hover:bg-neutral-200/80"
          >
            <SearchIcon className="size-4" />
            <span>Paste Image Url</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image Url</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Insert Image Url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleImageUrlSubmit();
              }
            }}
          />
          <DialogFooter>
            <Button onClick={handleImageUrlSubmit}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AlignButton = () => {
  const { editor } = useEditorStore();
  const alignments = [
    {
      label: "Align Left",
      value: "left",
      icon: AlignLeftIcon,
    },
    {
      label: "Align Center",
      value: "center",
      icon: AlignCenterIcon,
    },
    {
      label: "Align Right",
      value: "right",
      icon: AlignRightIcon,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustifyIcon,
    },
    
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
            editor?.isActive("highlight") ? "bg-neutral-200/80" : ""
          )}
        >
          <AlignLeftIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white flex flex-col gap-1">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={label}
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-md hover:bg-neutral-200/80",
              editor?.isActive({ textAlign: value }) && "bg-neutral-200/80"
            )}
            onClick={() => editor?.commands.setTextAlign(value)}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ListButton = () => {
  const { editor } = useEditorStore();
  const lists = [
    {
      label: "Bullet List",
      icon: ListIcon,
      isActive: () => editor?.isActive("bulletList"),
      onclick: () => editor?.commands.toggleBulletList(),
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      isActive: () => {
        return editor?.isActive("orderedList");
      },
      onclick: () => editor?.commands.toggleOrderedList(),
    },

  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
            editor?.isActive("highlight") ? "bg-neutral-200/80" : ""
          )}
        >
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white flex flex-col gap-1">
        {lists.map(({ label, icon: Icon, isActive, onclick }) => (
          <button
            key={label}
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-md hover:bg-neutral-200/80",
              isActive() && "bg-neutral-200/80"
            )}
            onClick={onclick}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontSizeButton = () => {
  const { editor } = useEditorStore();
  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";
  const PRESET_SIZES = [
    8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(currentFontSize);
  useEffect(() => {
    const currentFontSize = editor?.getAttributes("textStyle").fontSize
      ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
      : "16";
    setInputValue(currentFontSize);
  }, [editor, currentFontSize]);

  const decreaseSize = () => {
    const newSize =
      parseInt(currentFontSize) - 1 < 1 ? 1 : parseInt(currentFontSize) - 1;
    // setInputValue(newSize.toString());
    editor?.commands.setFontSize(`${newSize}px`);
  };
  const increaseSize = () => {
    const newSize = parseInt(currentFontSize) + 1;
    // setInputValue(newSize.toString());
    editor?.commands.setFontSize(`${newSize}px`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // const newInputSize = (e.target as HTMLInputElement).value;
      // const size = parseInt(newInputSize);
      const size = parseInt(inputValue);

      if (!isNaN(size) && size > 0) {
        editor?.commands.setFontSize(`${size}px`);
      }
      inputRef.current?.blur(); // 移除焦点
    }
  };

  // 保存选中的文字样式
  const restoreSelection = () => {
    if (!editor) return;

    // 保存当前选区
    const { from, to } = editor.state.selection;

    // 恢复选区
    editor.commands.setTextSelection({ from, to });
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsMenuOpen(open)}>
      <div className="flex gap-1">
        <button
          className="px-1 py-1 rounded-md hover:bg-neutral-200/80 cursor-pointer"
          onClick={increaseSize}
        >
          <PlusIcon className="size-4 " />
        </button>

        <div className="border-1 rounded-md flex gap-1 items-center px-1 border-gray-200">
          <input
            type="text"
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className="w-10 py-1 rounded-sm text-sm text-center bg-transparent"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <DropdownMenuTrigger asChild>
            <button
              onClick={restoreSelection}
              className={cn(
                "h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
                editor?.isActive("highlight") ? "bg-neutral-200/80" : ""
              )}
            >
              {isMenuOpen ? (
                <ArrowUpIcon className="size-3" />
              ) : (
                <ArrowDownIcon className="size-3" />
              )}
            </button>
          </DropdownMenuTrigger>
        </div>
        <button
          className="px-1 py-1 rounded-md hover:bg-neutral-200/80 cursor-pointer"
          onClick={decreaseSize}
        >
          <MinusIcon className="size-4 " />
        </button>
      </div>
      <DropdownMenuContent className="p-2.5 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white flex flex-col gap-1">
        {PRESET_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => editor?.commands.setFontSize(`${size}px`)}
            className={cn(
              "px-2 py-1 rounded-md hover:bg-neutral-200/80",
              currentFontSize === `${size}` && "bg-neutral-200/80"
            )}
          >
            <span className="text-sm">{size}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LineHeightButton = () => {
  const { editor } = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentLineHeight = editor?.getAttributes("textStyle").lineHeight;

  const lineHeights = [
    {
      label: "Single",
      value: "1",
      onClick: () => editor?.commands.setLineHeight("1"),
    },
    {
      label: "1.5",
      value: "1.5",
      onClick: () => editor?.commands.setLineHeight("1.5"),
    },
    {
      label: "Double",
      value: "2",
      onClick: () => editor?.commands.setLineHeight("2"),
    },
    {
      value: "2.5",
      onClick: () => editor?.commands.setLineHeight("2.5"),
    },
    {

      value: "3",
      onClick: () => editor?.commands.setLineHeight("3"),
    },
    {
      value: "other",
      onClick: () => setIsDialogOpen(true),
    },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            // onClick={() => restoreSelection(editor!)}
            className={cn(
              "h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
            )}
          >
            <ListCollapseIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5 z-10 border-1 border-gray-200 rounded-lg shadow-md bg-white flex flex-col gap-3 ">
          {lineHeights.map(({ label, value, onClick }) => (
            <DropdownMenuItem
              key={value}
              onClick={onClick}
              className={cn(
                "cursor-pointer px-2 py-1 rounded-sm hover:bg-neutral-200/80 ",
                value === currentLineHeight ? "bg-neutral-200/80 " : ""
              )}
            >
              <span>{label || value}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Line height</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter new line height"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const newLineHeight = e.currentTarget.value;
                editor?.commands.setLineHeight(newLineHeight);
                setIsDialogOpen(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};



interface ToolBarSectionProps {
  label: string;
  icon?: LucideIcon;
  component?: React.ReactNode;

  onClick?: (isActive?: boolean) => void;
  isActive?: boolean;
}
export default function ToolBar() {
  const { editor } = useEditorStore();

  // 第一组：基础操作
  const basicActions: ToolBarSectionProps[] = [
    {
      label: "Undo",
      icon: Undo2Icon,
      onClick: () => editor?.commands.undo(),
    },
    {
      label: "Redo",
      icon: Redo2Icon,
      onClick: () => editor?.commands.redo(),
    },
    {
      label: "Print",
      icon: PrinterIcon,
      onClick: () => window.print(),
    },
    {
      label: "Spell Check",
      icon: SpellCheckIcon,
      isActive: editor?.view.dom.getAttribute("spellcheck") === "true",
      onClick: () => {
        const current = editor?.view.dom.getAttribute("spellcheck");
        const newValue = current === "true" ? "false" : "true";
        editor?.view.dom.setAttribute("spellcheck", newValue);
        editor?.commands.focus();
      },
    },
  ];

  // 第二组：文本格式操作
  const textFormatActions: ToolBarSectionProps[] = [
    {
      label: "Bold",
      icon: BoldIcon,
      isActive: editor?.isActive("bold"),
      onClick: () => editor?.commands.toggleBold(),
    },
    {
      label: "Italic",
      icon: ItalicIcon,
      isActive: editor?.isActive("italic"),
      onClick: () => editor?.commands.toggleItalic(),
    },
    {
      label: "Underline",
      icon: UnderlineIcon,
      isActive: editor?.isActive("underline"),
      onClick: () => editor?.commands.toggleHighlight(),
    },
    {
      label: "Comment",
      icon: MessageSquarePlusIcon,
      isActive: editor?.isActive("liveblocksCommentMark"),
      onClick: () => editor?.commands.addPendingComment(),

    },
    {
      label: "List TODO",
      icon: ListTodoIcon,
      isActive: editor?.isActive("taskList"),
      onClick: () => editor?.commands.toggleTaskList(),
    },
    {
      label: "Remove Formatting",
      icon: RemoveFormattingIcon,
      onClick: () => editor?.commands.unsetAllMarks(),
    },
  ];

  // 合并所有操作组
  const normalButtons = [basicActions, textFormatActions];

  return (
    <div className="bg-[#F1F4F9] px-2.5 py-1 rounded-2xl min-h-[40px] flex gap-2 items-center overflow-x-auto">
      {normalButtons[0].map((section) => (
        <ToolBarButton {...section} key={section.label} />
      ))}
      <Separator orientation="vertical" className="!h-6 bg-neutral-300 mx-1 " />
      <FontFamilyButton />
      <div className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Separator
            orientation="vertical"
            className="!h-6 bg-neutral-300"
            key={i}
          />
        ))}
      </div>
      {normalButtons[1].map((section) => (
        <ToolBarButton {...section} key={section.label} />
      ))}
      <HeadingLevelButton />
      <TextColorButton />
      <HighLightColorButton />
      <LinkeButton />
      <ImageButton />
      <AlignButton />
      <ListButton />
      <Separator orientation="vertical" className="!h-6 bg-neutral-300 mx-1 " />
      <FontSizeButton />
      <Separator orientation="vertical" className="!h-6 bg-neutral-300 mx-1 " />
      <LineHeightButton/>
    </div>
  );
}
