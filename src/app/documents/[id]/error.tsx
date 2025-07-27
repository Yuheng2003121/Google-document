"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React from "react";

export default function Error({error, reset}: {error: Error, reset: () => void}) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-rose-100 p-3 rounded-full">
          <AlertTriangleIcon className="size-10 text-rose-600" />
        </div>
        <div className="text-center ">
          <h2 className="text-xl font-semibold text-gray-900">
            Someting went wrong
          </h2>
          <p>
            {error.message}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => reset()}>Retry</Button>
          <Button variant={"ghost"} onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    </div>
  );
}
