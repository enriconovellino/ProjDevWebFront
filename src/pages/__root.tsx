import { createRootRoute, Outlet } from '@tanstack/react-router'
import NotFound from '@/pages/_others/not-found'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return <Outlet />
}
