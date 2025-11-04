import { Outlet, createLazyFileRoute } from '@tanstack/react-router'
// 
// CORREÇÃO: Mudei de '@/components/...' para um caminho relativo.
// 
import { DoctorNavBar } from '../../components/common/doctor/DoctorNavBar'

// 1. Criamos a rota /_doctor (exatamente como o /_admin)
export const Route = createLazyFileRoute('/_doctor')({
  component: DoctorLayout,
})

// 2. Criamos o DoctorLayout (exatamente como o AdminLayout)
function DoctorLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* 3. A ÚNICA mudança é aqui: */}
      <DoctorNavBar />
      
      <Outlet />
    </div>
  )
}

