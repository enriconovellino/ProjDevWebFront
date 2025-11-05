import { useState } from 'react'
import '@/styles/App.css'
import '@/styles/index.css'
import { Separator } from "@/components/ui/separator"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { ArrowLeftFromLine, CircleUserRound, Settings } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'


interface NavItem {
  title: string
  href: string
}


const navItems: NavItem[] = [
  {
    title: "Medicos",
    href: "/admin-painel"
  },
  {
    title: "Pacientes",
    href: "/not-found"
  },
  {
    title: "Atendimentos",
    href: "/not-found"
  },

]

export function NavBar() {
  const [activeLink, setActiveLink] = useState("/")
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate({ to: '/sign-in' })
  }

  // Gera as iniciais do usuário para o avatar
  const getUserInitials = () => {
    if (!user?.nome) return 'U'
    const names = user.nome.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0][0].toUpperCase()
  }

  return (
    <>
      <nav className='fixed top-0 left-0 right-0 z-50 bg-background px-10 py-7 bg-[var(--background)]'>
        <div className="flex items-center justify-between ">
          <div className="flex items-center">
            <img
              src="/src/assets/images/logo2.svg"
              alt="Logo"
              className="h-8 w-auto transition-transform duration-200 hover:scale-105"
            />
          </div>
          <NavigationMenu className="flex items-center mx-auto ">
            <NavigationMenuList className="space-x-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "transition-all duration-300 ease-in-out",
                      "hover:bg-accent hover:text-accent-foreground",
                      "hover:scale-105 hover:shadow-sm",
                      "active:scale-95",
                      "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      // Destaca o link ativo
                      activeLink === item.href && "bg-accent text-accent-foreground"
                    )}
                    href={item.href}
                    onClick={() => setActiveLink(item.href)}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Avatar>
                <AvatarImage src="" alt={user?.nome || 'Usuário'} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 m-4 bg-[var(--background)] rounded-lg p-2  ">
              <div className="px-3 py-2 text-sm">
                <p className="font-medium">{user?.nome || 'Usuário'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
              <DropdownMenuGroup className='flex  items-center hover:bg-[var(--primary)]/8 rounded-md  ' >
                <DropdownMenuItem className='cursor-pointer' onClick={() => navigate({ to: '/profile' })}>
                <CircleUserRound width={20} />
                  Perfil
                </DropdownMenuItem>
              </DropdownMenuGroup>
               <DropdownMenuGroup className='flex  items-center hover:bg-[var(--primary)]/8 rounded-md '>
                <DropdownMenuItem className='cursor-pointer' onClick={() => navigate({ to: '/settings-adm' })}>
                  <Settings width={20} />
                  Configurações
                </DropdownMenuItem>
              </DropdownMenuGroup>
               <DropdownMenuGroup>
                <DropdownMenuItem
                  className= 'cursor-pointer text-red-600 hover:bg-red-500/10 hover:text-red-700'
                  onClick={handleLogout}
                >
                <ArrowLeftFromLine width={20} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <Separator className='mb-20' />
    </>
  )
}