import { createRootRoute, Outlet } from '@tanstack/react-router'
import NotFound from '@/pages/_others/not-found'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  )
}
