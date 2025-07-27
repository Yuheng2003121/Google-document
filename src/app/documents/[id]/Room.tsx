"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { getUsers, getDocuments } from "./action";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/app/constants";

interface User {
  id: string;
  name: string;
  avatar: string;
  color?: string;
}
export function Room({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const userLists = await getUsers();
      setUsers(userLists);
    } catch (error) {
      toast.error("Failed to fetch users. Please try again later.");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, [id]);

  return (
    <LiveblocksProvider
      // publicApiKey={
      //   "pk_dev_SBfuF32wiP21N8jH7DvGlqS_YApLYTS8UrwJkg7CwX5q-XcuqQxS5DQWFThuP5yM"
      // }
      throttle={16}
      authEndpoint={async () => {
        const endPoint = "/api/liveblocks-auth";
        const response = await fetch(endPoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: id,
          }),
        });

        return await response.json();
      }}
      // resolveUsers是一个用于 ​​将用户 ID 映射为用户信息​​ 的回调函数，主要用于实时协作场景中显示其他用户的信息（如头像、名称等）
      resolveUsers={({ userIds }) => {
        // 从本地 users 中查找匹配的该room活跃用户的详细信息
        return userIds.map((userId) => {
          const user = users.find((u) => u.id === userId);
          return user
            ? {
                name: user.name || "Unknown",
                avatar: user.avatar || "", // 确保是字符串
                color: user.color || "#000000", // 默认黑色
              }
            : {
                name: "Unknown",
                avatar: "",
                color: "#000000",
              };
        });
      }}
      // 当需要显示用户当前参与的多个房间（如文档列表、项目看板）时，用于将 ​​房间 ID 数组​​ 转换为 ​​包含房间信息的对象数组, （如房间名称、封面图等）。
      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<"documents">[]);
        return documents.map((document) => ({
          id: document.id,
          name: document.name,
        }));
      }}
      // 当用户在编辑器中输入 @触发提及功能时，用于 ​​返回可提及的用户列表​​（过滤和排序逻辑可自定义）。
      resolveMentionSuggestions={({ text }) => {
        let filterUsers = users;
        if (text) {
          filterUsers = users.filter((u) =>
            u.name.toLowerCase().includes(text.toLowerCase())
          );
        }

        return filterUsers.map((u) => u.id);
      }}
    >
      <RoomProvider
        id={id as string}
        initialStorage={{
          leftMargin: LEFT_MARGIN_DEFAULT,
          rightMargin: RIGHT_MARGIN_DEFAULT,
        }}
      >
        <ClientSideSuspense fallback={<Loading label="Loading document..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
