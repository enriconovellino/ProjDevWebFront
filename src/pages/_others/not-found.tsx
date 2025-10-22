import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute('/_others/not-found')({
  component: NotFound,
})

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen m-7">
        <Card className="w-full max-w-md m-10 p-6">
          <CardHeader>
            <CardTitle className="font-semibold text-2xl text-center">
              Erro 404 - Pagina não encontrada
            </CardTitle>
            <CardDescription className="text-center"></CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              Oops! A página que você procurou não foi encontrada.
            </p>
            <p className="text-sm text-muted-foreground">
              Ela pode ter sido movida, renomeada ou nunca existiu.
            </p>
          </CardContent>
        </Card>
    </div>
  )
}

export default NotFound


