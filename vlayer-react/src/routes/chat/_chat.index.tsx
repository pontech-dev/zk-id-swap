import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/_chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  return "You can contact to the seller here!";
}
