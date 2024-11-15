import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/aspect")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello /chat/aspect!";
}
