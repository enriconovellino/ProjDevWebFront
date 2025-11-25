import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Calendar, FileText, User, Home, Search, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/_patient')({
  component: PatientLayout,
})

function PatientLayout() {
  const { user, logout } = useAuth()

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      label: 'Buscar Médico',
      href: '/find-doctor',
      icon: Search,
    },
    {
      label: 'Minhas Consultas',
      href: '/appointments',
      icon: Calendar,
    },
    {
      label: 'Prontuário',
      href: '/medical-records',
      icon: FileText,
    },
    {
      label: 'Meu Perfil',
      href: '/patient-profile',
      icon: User,
    },
  ]

  return (
    <ProtectedRoute requiredProfiles={['PACIENTE']} fallbackRoute="/sign-in">
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Logo */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">HealthPlus</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} to={item.href}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start gap-3 ${
                        isActive
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback>
                  {user?.nome?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.nome}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-64">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  )
}

