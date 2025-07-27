import Image from "next/image";
import Link from "next/link";
import React from "react";
import SearchInput from "./SearchInput";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex justify-between h-full ">
      <div className="flex items-center flex-1">
        <div className="flex gap-3 items-center shrink-0 pr-6">
          <Link href={"/"}>
            <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
          </Link>
          <h3 className="text-xl">Docs</h3>
        </div>
        <SearchInput />
        <div className="flex gap-4 items-center ml-6">
          <OrganizationSwitcher
            afterCreateOrganizationUrl="/"
            afterLeaveOrganizationUrl="/"
            afterSelectPersonalUrl="/"
            afterSelectOrganizationUrl="/"
          />
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
