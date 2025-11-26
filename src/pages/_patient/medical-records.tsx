import { createFileRoute } from '@tanstack/react-router'
import { FileText, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/_patient/medical-records')({
  component: PatientMedicalRecords,
})

function PatientMedicalRecords() {
  const records = [
    {
      id: '1',
      title: 'Consulta - Cardiologia',
      date: '2025-11-20',
      doctor: 'Dr. João Silva',
      type: 'consulta',
    },
    {
      id: '2',
      title: 'Exame de Sangue',
      date: '2025-11-15',
      doctor: 'Dr. Carlos Santos',
      type: 'exame',
    },
    {
      id: '3',
      title: 'Prescrição Médica',
      date: '2025-11-10',
      doctor: 'Dra. Maria Santos',
      type: 'prescricao',
    },
  ]

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Prontuário Médico
          </h1>
          <p className="text-muted-foreground">
            Acesse seu histórico médico e documentos
          </p>
        </div>

        {/* Registros Médicos */}
        <div className="space-y-4">
          {records.map(record => (
            <Card key={record.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <FileText className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {record.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(record.date).toLocaleDateString('pt-BR')} • {record.doctor}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Baixar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
