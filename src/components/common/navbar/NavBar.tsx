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
    href: "/sign-in"
  },
  {
    title: "Atendimentos",
    href: "/servicos"
  },
  
]

export function NavBar() {
  const [activeLink, setActiveLink] = useState("/")

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

         <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
          
        </div>
      </nav>
      <Separator className='mb-20' />
    </>
  )
}