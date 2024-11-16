import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/$target')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /chat/aspect!'
}
