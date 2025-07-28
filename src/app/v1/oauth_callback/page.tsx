"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Loading from "@/components/Loading";

export default function OAuthCallback() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        router.push("/"); // 登录成功后重定向到主页
      } else {
        router.push("/sign-in"); // 如果没有用户信息，重定向到登录页
      }
    }
  }, [isLoaded, userId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading label="Processing login..." />
    </div>
  );
}
