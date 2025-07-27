// components/DocumentInput.tsx
"use client"; // 确保这是客户端组件

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsCloudCheck } from "react-icons/bs";
import { Doc, Id } from "../../../../convex/_generated/dataModel"; // 确保导入 Id 类型
import { api } from "../../../../convex/_generated/api"; // 导入 api
import { useQuery, useMutation } from "convex/react"; // 导入 useMutation

import { cn } from "@/lib/utils";
import { debounce } from "lodash";

export default function DocumentInput({
  document, 
}: {
  document: Doc<"documents">; 
}) {
  // 1. 获取文档数据 (用于初始化标题)
  // const document = useQuery(api.documents.getDocumentById, { id: documentId });
  const documentId = document?._id as Id<"documents">;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState(false);

  // 2. 初始化本地标题状态
  const [title, setTitle] = useState(document?.title || "Untitled Document");

  // 3. 使用 useMutation Hook 调用 Convex 的 updateDocumentById 函数
  const updateTitleMutation = useMutation(api.documents.updateDocumentById);

  // ✅ 防抖保存函数（500ms无新输入后执行）
  const debouncedSave = useMemo(
    () =>
      debounce(async (title: string) => {
        try {
          await updateTitleMutation({ documentId, title });
        } catch (err) {
          console.error("Debounced save failed:", err);
        }
      }, 500),
    [documentId] // 依赖变化时重建防抖函数
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(newTitle);
  };

  // 4. 当 Convex 返回的 document 数据更新时，同步本地状态
  //    (例如，如果其他用户或进程修改了标题)
  useEffect(() => {
    if (document?.title) {
      setTitle(document.title);
    }
  }, [document?.title]);

  // 6. 表单提交处理函数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsPending(true);
      // 调用 Convex Mutation
      await updateTitleMutation({ documentId, title });
      setIsPending(false);
      inputRef.current?.blur();
    } catch (err) {}
  };

  // 7. 输入框失焦时处理函数 (自动保存)
  const handleBlur = async () => {
    // 检查标题是否真的发生了变化，避免不必要的请求
    if (title !== (document?.title || "Untitled Document")) {
      try {
        await updateTitleMutation({ documentId, title });
      } catch (err) {
        console.error("Failed to update title on blur:", err);
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* 9. 包含输入框的表单 */}
      <form onSubmit={handleSubmit} className="relative w-fit ">
        <span className="invisible whitespace-pre px-2 text-lg">
          {title || ""}
        </span>
        <input
          ref={inputRef}
          value={title}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isPending} // 保存时禁用输入框
          className="absolute inset-0 text-lg text-black px-2 bg-transparent truncate !border-blue-500 rounded-md"
        />
      </form>

      {/* 10. 显示保存状态 */}
      {isPending ? (
        <span className="text-sm text-muted-foreground animate-pulse">
          Saving...
        </span>
      ) : (
        <BsCloudCheck />
      )}
    </div>
  );
}
