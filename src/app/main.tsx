import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import App from './App.tsx'
import AdmSearchPanel from '@/pages/AdmSearchPanel.tsx'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routes/routeTree.ts'


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
