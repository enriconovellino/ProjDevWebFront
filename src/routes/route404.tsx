// src/routes/not-found.tsx
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root'
import {NotFound } from '@/pages/NotFound' // ajuste o import conforme export do componente

export const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '',             // wildcard reservado para 404
  component: NotFound,
})