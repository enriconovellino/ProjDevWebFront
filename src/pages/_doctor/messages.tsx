import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_doctor/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_doctor/messages"!</div>
}
