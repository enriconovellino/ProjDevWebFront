import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <>
      <div className='px-10 py-7'>
        <img src="/src/assets/images/logo2.svg" alt="Logo" className="h-8 w-auto" />
      </div>
      <Separator/>
      <Outlet />
    </>
  )
}
