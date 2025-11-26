import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './pages/routeTree.gen'
import { AuthProvider } from './contexts/AuthContext'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
