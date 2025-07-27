"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { templates } from "../constants";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

export default function TemplateGallery() {
  const router = useRouter();
  const create = useMutation(api.documents.addDocument)
  
  const [isCreating, setIsCreating] = useState(false);
  const onTemplateClick = async (label: string, initialContent: string) => {
    setIsCreating(true);
    try {
      const newDocId = await create({
        title: label,
        initialContent,
      });
      toast.success("Document created successfully.");
      router.push(`/documents/${newDocId}`);
    } catch (error) {
      if(error instanceof ConvexError) {
        toast.error(error.data)
      }
    } finally {
      setIsCreating(false);
    }
  }
  return (
    <div className="bg-[#F1F3F4]">
      <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-4 ">
        <h3 className="text-base font-medium ">Start a new document</h3>
        <Carousel
          opts={{
            align: "start", // 对齐起始位置
          }}
        >
          <CarouselContent>
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className={cn(
                  "pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.2857%] aspect-[3/4] flex flex-col gap-2.5 ",
                  isCreating && "opacity-50 pointer-events-none"
                )}
              >
                <button
                  disabled={isCreating}
                  onClick={(e) => {
                    e.stopPropagation();
                     onTemplateClick(template.label, template.initialContent);
                  }}
                  className="w-full h-full relative rounded-md  hover:scale-110 transform origin-center transition-all bg-white "
                >
                  <Image
                    fill
                    src={template.imageUrl}
                    alt={template.label}
                    className=""
                  />
                </button>
                <p className="text-sm font-medium truncate ">
                  {template.label}
                </p>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="border-none" />
          <CarouselPrevious className="border-none" />
        </Carousel>
      </div>
    </div>
  );
}
