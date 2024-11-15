import { Button } from "@/components/ui/button";
import {
  useChatActions,
  useChatList,
  useChatRequests,
} from "@/hooks/push-chat";
import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const account = useAccount();
  const { data: chatRequests } = useChatRequests();
  const { data: chatList } = useChatList();
  const { sendMessage } = useChatActions();

  if (!account.isConnected)
    return <div className="p-4">Please connect your wallet</div>;

  console.log(chatRequests);
  console.log(chatList);

  return (
    <div>
      <h1>Chat</h1>
      <Button
        onClick={() =>
          sendMessage("0xB9825fcB2aFD2ad9047a78b2422a5D888b2E54DA", "Hello")
        }
      >
        Send Message
      </Button>
    </div>
  );
}
