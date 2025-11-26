import React, { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { Patient } from '../../lib/types'
import {
  Card,
  CardContent,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Search } from 'lucide-react'
import { doctorService } from '../../services/doctor.service'
import { handleApiError } from '../../services/api'

export const Route = createFileRoute('/_doctor/patients/')({
  component: PatientsPage,
})

function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Busca pacientes da API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await doctorService.getPatients();
        setPatients(data);
        setFilteredPatients(data);
      } catch (err) {
        const errorMsg = handleApiError(err);
        setError(errorMsg);
        console.error('Erro ao buscar pacientes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filtra pacientes com base no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(term) ||
      patient.email.toLowerCase().includes(term) ||
      patient.phone.includes(term)
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  if (isLoading) {
    return <h1 className="p-6 text-2xl font-semibold">Carregando pacientes...</h1>;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl p-6 py-10">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <h2 className="font-semibold mb-2">Erro ao carregar pacientes</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Pacientes
        </h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? 'Nenhum paciente encontrado.' : 'Nenhum paciente cadastrado.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-7 gap-4 p-4 border-b border-border bg-muted/50">
                  <span className="col-span-1 text-sm font-medium text-muted-foreground">Nome</span>
                  <span className="col-span-1 text-sm font-medium text-muted-foreground">Data de Nascimento</span>
                  <span className="col-span-1 text-sm font-medium text-muted-foreground">Gênero</span>
                  <span className="col-span-1 text-sm font-medium text-muted-foreground">Telefone</span>
                  <span className="col-span-1 text-sm font-medium text-muted-foreground">Email</span>
                  <span className="col-span-2 text-sm font-medium text-muted-foreground">Ações</span>
                </div>

                {filteredPatients.map(patient => {
                  const formattedDob = patient.dob
                    ? new Date(patient.dob).toLocaleDateString('pt-BR')
                    : '-';

                  return (
                    <div key={patient.id} className="grid grid-cols-7 gap-4 p-4 border-b border-border last:border-b-0 items-center">
                      <span className="col-span-1 font-medium text-foreground">{patient.name}</span>
                      <span className="col-span-1 text-muted-foreground text-sm">{formattedDob}</span>
                      <span className="col-span-1 text-muted-foreground text-sm">{patient.gender}</span>
                      <span className="col-span-1 text-muted-foreground text-sm">{patient.phone}</span>
                      <span className="col-span-1 text-muted-foreground text-sm">{patient.email}</span>
                      <div className="col-span-2 flex gap-4">
                        <Link
                          to="/patients/$patientId"
                          params={{ patientId: String(patient.id) }}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Ver Detalhes
                        </Link>

                        <button
                          onClick={() => { /* Lógica para abrir o modal aqui */ }}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Adicionar Anotação
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

