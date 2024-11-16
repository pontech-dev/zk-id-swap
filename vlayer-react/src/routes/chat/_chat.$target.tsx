import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatHistory } from "@/hooks/push-chat";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/_chat/$target")({
  component: RouteComponent,
});

function RouteComponent() {
  const { target } = Route.useParams();
  const history = useChatHistory(target);

  console.log("history", history.data);

  return (
    <div className="flex-1 flex flex-col p-2">
      <div className="flex-1"></div>
      <div className="flex gap-2">
        <Input />
        <Button>Send</Button>
      </div>
    </div>
  );
}
