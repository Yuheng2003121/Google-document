"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function SearchInput() {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(value.trim() === "") {
      router.push("/");
      return
    }
    const params = new URLSearchParams();
    params.set("search", value.trim());
    router.push(`/?${params.toString()}`);
    setValue("");
    
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <form onSubmit={handleSubmit} className="relative max-w-[720px] w-full">
        <Input
          type="text"
          value={value}
          onChange={onChange}
          ref={inputRef}
          placeholder="Search"
          className="md:text-base rounded-full px-12 py-5 placeholder:text-neutral-500 w-full border-0 focus:border-1 focus:border-gray-200 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none focus-visible:shadow-lg bg-[#F0F4F8] focus:bg-white"
        />
        <Button
          type="submit"
          variant={"ghost"}
          size={"icon"}
          className="absolute left-1 rounded-full top-1/2 -translate-y-1/2"
        >
          <SearchIcon className="size-4" />
        </Button>
        {value && (
          <Button
            type="button"
            variant={"ghost"}
            onClick={handleClear}
            size={"icon"}
            className="absolute right-2 rounded-full top-1/2 -translate-y-1/2"
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </form>
    </div>
  );
}
