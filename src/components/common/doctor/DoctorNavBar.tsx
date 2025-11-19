import React from 'react'
// Importa o Link do TanStack Router para navegação
import { Link } from '@tanstack/react-router'
// Importa componentes 'shadcn/ui' que vemos na imagem
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle, // Estilo base para os links
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
// Importa o ícone de sino (notificações)
import { Bell } from 'lucide-react'
// Importa a função 'cn' para aplicar classes
import { cn } from "@/lib/utils"

// 1. Define os links de navegação do médico (ATUALIZADO para inglês)
const navItems = [
  { title: "Home", href: "/home" },
  { title: "Pacientes", href: "/patients" },
  { title: "Agenda", href: "/schedule" },
  { title: "Mensagens", href: "/messages" },
  { title: "Configurações", href: "/settings"}
]

export function DoctorNavBar() {
  return (
    // Usa 'bg-background' (do seu index.css) e 'border-b'
    <nav className='sticky top-0 z-50 flex h-20 items-center justify-between border-b border-border bg-background px-10 py-4'>
      
      {/* Lado Esquerdo: Logo e Navegação */}
      <div className="flex items-center gap-10">
        
        {/* Logo "HealthPlus" (como na imagem) */}
        <Link to="/home" className="text-2xl font-bold text-primary">
          HealthPlus
        </Link>

        {/* Menu de Navegação (shadcn) */}
        <NavigationMenu>
          <NavigationMenuList className="space-x-1">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                {/* Usamos o <Link> do TanStack Router DENTRO do item de menu.
                  Isto dá-nos navegação SPA (sem recarregar a página)
                  e controlo de classe 'ativa'.
                */}
                <Link
                  to={item.href}
                  // Aplica o estilo 'shadcn' por defeito
                  className={cn(navigationMenuTriggerStyle(), "text-base")}
                  // Aplica classes 'shadcn' (accent) quando a rota está ativa
                  activeProps={{
                    className: "bg-accent text-accent-foreground"
                  }}
                >
                  {item.title}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Lado Direito: Notificações e Avatar */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>

        {/* Avatar (usa 'shadcn') */}
        <Avatar>
          {/* Pode trocar 'src' por uma prop vinda do 'profile' */}
          <AvatarImage src="https://github.com/shadcn.png" alt="Dr. Ricardo" />
          <AvatarFallback>RA</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}

