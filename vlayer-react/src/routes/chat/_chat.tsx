import { Button } from "@/components/ui/button";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  useChatActions,
  useChatList,
  useChatRequests,
  usePushClient,
} from "@/hooks/push-chat";
import { parseTarget, pickContent } from "@/lib/push";
import { formatDate } from "@/lib/utils";
import { IFeeds } from "@pushprotocol/restapi";
import { Link, useRouter } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { Address } from "viem";

export const Route = createFileRoute("/chat/_chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const account = useAccount();
  const { initializePushClient, pushClient } = usePushClient();
  const chatRequests = useChatRequests();
  const chatList = useChatList();
  const { acceptRequest, rejectRequest, sendMessage } = useChatActions();

  if (!account.isConnected)
    return (
      <div className="flex flex-1 justify-center items-center">
        Please connect your wallet
      </div>
    );

  if (!pushClient.data)
    return (
      <div className="flex flex-1 justify-center items-center">
        <Button onClick={initializePushClient}>Initialize Push Client</Button>
      </div>
    );

  console.log("chatRequests", chatRequests.data);
  console.log("chatList", chatList.data);

  const handleDebugSendMessage = async () => {
    const target = prompt("Enter target");
    if (!target) return;
    await sendMessage(target as Address, "Hello, world!");

    chatRequests.refetch();
    chatList.refetch();
  };
  const handleAcceptChatRequest = (feed: IFeeds) => {
    const target = parseTarget(feed);
    acceptRequest(target);
    chatRequests.refetch();
    chatList.refetch();
    router.navigate({
      to: "/chat/$target",
      params: { target: feed.chatId as string },
    });
  };
  const handleRejectChatRequest = (feed: IFeeds) => {
    const target = parseTarget(feed);
    rejectRequest(target);
    chatRequests.refetch();
    chatList.refetch();
  };
  return (
    <div className="flex flex-1">
      <div className="w-1/2 max-w-xs h-full border-r">
        <SidebarContent>
          <Button onClick={handleDebugSendMessage}>Debug Send Message</Button>
          {chatRequests.data && chatRequests.data.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Chat Requests</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-2">
                {chatRequests.data.map((chatRequest) => (
                  <div
                    key={chatRequest.chatId}
                    className="p-2 border rounded-lg flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm font-medium truncate max-w-24">
                        {parseTarget(chatRequest)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(chatRequest.msg.timestamp ?? 0)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {pickContent(chatRequest)}
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-6 w-16"
                        onClick={() => handleAcceptChatRequest(chatRequest)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-16"
                        onClick={() => handleRejectChatRequest(chatRequest)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarContent>
          {chatList.data && chatList.data.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Chat List</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-2">
                {chatList.data.map((chat) => (
                  <Link
                    key={chat.chatId}
                    to="/chat/$target"
                    params={{ target: chat.chatId as string }}
                    className="p-2 border rounded-lg flex flex-col transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm font-medium truncate max-w-24">
                        {parseTarget(chat)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(chat.msg.timestamp ?? 0)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {pickContent(chat)}
                    </div>
                  </Link>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </div>
      <Outlet />
    </div>
  );
}
