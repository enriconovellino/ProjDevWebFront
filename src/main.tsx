import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './pages/routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
