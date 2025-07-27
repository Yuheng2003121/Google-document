import { Button } from "@/components/ui/button";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { ClientSideSuspense, useInboxNotifications } from "@liveblocks/react/suspense";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { BellIcon, LoaderIcon } from "lucide-react";

export const Inbox = () => {
  return (
    <ClientSideSuspense
      fallback={
        <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
      }
    >
      <InboxMenu />
    </ClientSideSuspense>
  );
}



const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="relative" size="icon">
          <BellIcon className="size-5" />
          {inboxNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-sky-500 text-xs text-white flex items-center justify-center">
              {inboxNotifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {inboxNotifications.length > 0 ? (
          <InboxNotificationList>
            {inboxNotifications.map((inboxNotification) => {
              return (
                <InboxNotification
                  key={inboxNotification.id}
                  inboxNotification={inboxNotification}
                />
              )
            })}
          </InboxNotificationList>
        ) : (
          <div className="p-2 w-[400px] text-center text-sm text-muted-foreground">
            No notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
