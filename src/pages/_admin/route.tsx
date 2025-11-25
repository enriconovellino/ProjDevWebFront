import { Outlet, createFileRoute } from '@tanstack/react-router'
import { NavBar } from '@/components/common/navbar/NavBar'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

export const Route = createFileRoute('/_admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <ProtectedRoute requiredProfiles={['ADMIN']} fallbackRoute="/patient/dashboard">
      <div className="min-h-screen bg-background">
        <NavBar />
        <Outlet />
      </div>
    </ProtectedRoute>
  )
}
