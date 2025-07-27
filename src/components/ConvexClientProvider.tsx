"use client";
import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Loading from "./Loading";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // 如果是登录页，直接渲染 children（即 sign-in/page.tsx 的内容）
  if (pathname?.startsWith("/sign-in")) {
    return (
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    );
  }

  // 非登录页的逻辑
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Authenticated>{children}</Authenticated>
      {/* {children} */}
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-screen">
          <LogIn size={20} className="mr-2" />
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Login/Register
          </Link>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <Loading label="Auth Loading..." />
      </AuthLoading>
    </ConvexProviderWithClerk>
  );
}
