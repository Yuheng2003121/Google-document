import Navbar from "./Navbar";
import TemplateGallery from "./TemplateGallery";
import DocumentList from "./DocumentList";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google document", // 页面标题
  description: "Your page description", // 可选描述
};

export default function Home() {
  
  return (
    <div className="">
      <div className="flex min-h-screen flex flex-col">
        <div className="fixed top-0 inset-x-0 z-10 h-16 bg-white p-4">
          <Navbar />
        </div>
        <div className="mt-16">
          <TemplateGallery />
          {/* <Suspense fallback={<Loading label="Loading documents..."/>}> */}
          <Suspense>
            <DocumentList/>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
