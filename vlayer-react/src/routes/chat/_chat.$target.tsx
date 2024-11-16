import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/_chat/$target")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello /chat/_chat/$target!";
}
