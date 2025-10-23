import { Outlet, createLazyFileRoute } from '@tanstack/react-router'
import { NavBar } from '@/components/common/navbar/NavBar'

export const Route = createLazyFileRoute('/_admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <Outlet />
    </div>
  )
}
