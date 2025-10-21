// src/routes/login.tsx
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root'
import { Login } from '@/pages/Login'

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',          // <-- sem a barra inicial
  component: Login,       
})