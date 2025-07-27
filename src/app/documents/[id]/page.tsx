import React, { Suspense } from "react";
import DocEditor from "./Editor";
import ToolBar from "./ToolBar";
import Navbar from "./Navbar";
import { Room } from "./Room";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Detail", // 页面标题
  description: "Your page description", // 可选描述
};

export default async function Page({ params }: { params: Promise<{ id: Id<"documents"> }> }) {
  const { id: documentId } = await params;
  const preloadedDocument = await preloadQuery(api.documents.getDocumentById, {
    id: documentId,
  });

  return (
    <Room>
      <div className="min-h-screen bg-[#f9faff]">
        <div className="flex flex-col px-4 pt-2 fixed inset-x-0 z-10 bg-[#FAFBFD] print:hidden">
          <Suspense>
            <Navbar documentId={documentId} />
          </Suspense>
          <ToolBar />
        </div>
        <div className="pt-30 print:pt-0">
          <DocEditor preLoadDoc={preloadedDocument}/>
        </div>
      </div>
    </Room>
  );
}
