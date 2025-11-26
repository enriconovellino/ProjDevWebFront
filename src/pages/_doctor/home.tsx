import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { Appointment } from '../../lib/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { doctorService } from '../../services/doctor.service'
import { handleApiError } from '../../services/api'

export const Route = createFileRoute('/_doctor/home')({
  component: HomePage,
})

function HomePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Busca consultas de hoje da API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await doctorService.getTodayAppointments();
        setAppointments(data);
      } catch (err) {
        const errorMsg = handleApiError(err);
        setError(errorMsg);
        console.error('Erro ao buscar consultas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (isLoading) {
    return <h1 className="p-6 text-2xl font-semibold">Carregando...</h1>;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl p-6 py-10">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <h2 className="font-semibold mb-2">Erro ao carregar consultas</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Consultas de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma consulta agendada para hoje.
            </div>
          ) : (
            <div className="border-t border-border">
              <div className="grid grid-cols-4 gap-4 p-4 border-b border-border bg-muted/50">
                <span className="text-sm font-medium text-muted-foreground">Paciente</span>
                <span className="text-sm font-medium text-muted-foreground">Horário</span>
                <span className="text-sm font-medium text-muted-foreground">Especialidade</span>
                <span className="text-sm font-medium text-muted-foreground">Status</span>
              </div>

              {appointments.map(appt => {
                const time = new Date(appt.dateTime).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={appt.id} className="grid grid-cols-4 gap-4 p-4 border-b border-border last:border-b-0 items-center">
                    <span className="font-medium text-foreground">{appt.patient}</span>
                    <span className="text-muted-foreground">{time}</span>
                    <span className="text-muted-foreground">{appt.specialty}</span>
                    <span className="text-muted-foreground">{appt.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

