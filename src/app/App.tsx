import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='px-10 py-7 '>
      <img src="/src/assets/images/logo2.svg" alt="Logo" className="h-8 w-auto" />
    </div>
    <Separator/>

    <div className='flex flex-col items-center justify-center m-7'>
      <h1 className='text-3xl font-bold'>Bem-Vindo de volta</h1>
      <Card className='w-full max-w-md m-10 p-6'> {/* Responsivo e com padding */}
        <CardHeader>
          <CardTitle className='font-semibold text-2xl text-center'>Entrar</CardTitle>
          <CardDescription className='text-center'>Entre com suas credenciais</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4"> {/* Espaçamento entre elementos */}
            <div className="flex flex-col space-y-2">
              <label className='font-bold text-sm' htmlFor="email">Email</label>
              <input 
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                type='email' 
                id="email"
                placeholder='exemplo@email.com' 
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className='font-bold text-sm' htmlFor="password">Senha</label>
              <input 
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                type='password' 
                id="password"
                placeholder='Sua senha' 
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Entrar
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  </>
  )
}

export default App
