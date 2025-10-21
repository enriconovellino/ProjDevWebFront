import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import App from './App.tsx'
import AdmSearchPanel from '@/pages/AdmSearchPanel.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdmSearchPanel/>
  </StrictMode>,
)
