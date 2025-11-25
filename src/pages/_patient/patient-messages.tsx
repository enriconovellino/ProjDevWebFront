import { createFileRoute } from '@tanstack/react-router'
import { MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const Route = createFileRoute('/_patient/patient-messages')({
  component: PatientMessages,
})

function PatientMessages() {
  const messages = [
    {
      id: '1',
      doctorName: 'Dr. João Silva',
      specialty: 'Cardiologia',
      lastMessage: 'Você recebeu os resultados do exame. Tudo corre bem!',
      timestamp: '2025-11-20 14:30',
      unread: 2,
    },
    {
      id: '2',
      doctorName: 'Dra. Maria Santos',
      specialty: 'Dermatologia',
      lastMessage: 'Qual é o melhor horário para agendar?',
      timestamp: '2025-11-19 09:15',
      unread: 0,
    },
  ]

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Mensagens
          </h1>
          <p className="text-muted-foreground">
            Comunique-se com seus médicos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Conversas */}
          <div className="lg:col-span-1 space-y-2">
            {messages.map(message => (
              <Card
                key={message.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {message.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {message.doctorName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {message.specialty}
                    </p>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {message.lastMessage}
                    </p>
                  </div>
                  {message.unread > 0 && (
                    <div className="bg-blue-500 text-white text-xs font-semibold h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                      {message.unread}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Área de Chat */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-96 flex flex-col">
              <div className="text-center flex items-center justify-center h-full text-muted-foreground">
                <MessageSquare className="h-12 w-12 opacity-50 mr-3" />
                <p>Selecione uma mensagem para iniciar a conversa</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
