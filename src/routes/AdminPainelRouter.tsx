// src/routes/login.tsx
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root'
import  AdmSearchPanel  from '@/pages/AdmSearchPanel'

export const AdminPainelRouter = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin-painel',          // <-- sem a barra inicial
  component: AdmSearchPanel,       
})