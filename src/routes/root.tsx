// src/routes/root.tsx
import {AdmSearchPanel} from '@/pages/AdmSearchPanel'
import { createRootRoute, Outlet} from '@tanstack/react-router'
import NotFound from '@/pages/NotFound'

export const rootRoute = createRootRoute({
  component: () =>  <Outlet />,
  notFoundComponent: NotFound,
})