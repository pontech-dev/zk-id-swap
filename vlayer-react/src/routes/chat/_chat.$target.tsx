import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatActions, useChatHistory, useChatList } from "@/hooks/push-chat";
import { isMe, parseMessageId, parseTarget } from "@/lib/push";
import { createFileRoute } from "@tanstack/react-router";
import { parseMessageContent } from "@/lib/push";
import { useAccount } from "wagmi";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, RefreshCcwIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import { Address } from "viem";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/_chat/$target")({
  component: RouteComponent,
});

function RouteComponent() {
  const { target } = Route.useParams();
  const account = useAccount();
  const chatlist = useChatList();
  const history = useChatHistory(target);
  const { sendMessage } = useChatActions();

  const chat = chatlist.data?.find((chat) => chat.chatId === target);

  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!chat) return;
    await sendMessage(target as Address, message);
    setMessage("");
    history.refetch();
  };

  console.log("history", history.data);

  return (
    <div className="flex-1 flex flex-col p-2 gap-4">
      <div className="flex p-2 gap-2 items-center">
        <Button variant="ghost" size="icon" asChild className="sm:hidden">
          <Link href="/chat">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <Avatar>
          <AvatarFallback>
            {chat && parseTarget(chat).slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="text-base font-bold max-w-64 truncate">
          {chat && parseTarget(chat)}
        </div>
        <div className="flex-1 flex justify-end" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => history.refetch()}
          disabled={history.isFetching}
          className={cn("flex-shrink-0 ", history.isFetching && "animate-spin")}
        >
          <RefreshCcwIcon />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse gap-2">
        {history.data?.map((message) => (
          <div
            key={parseMessageId(message)}
            className={cn(
              "flex",
              isMe(message, account.address) && "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] w-full p-2 rounded-lg",
                isMe(message, account.address)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {parseMessageContent(message)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 sticky bottom-0">
        <Input
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend} className="flex-shrink-0">
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}
