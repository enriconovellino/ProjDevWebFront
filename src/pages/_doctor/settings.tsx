import React, { useState, useEffect, FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Separator } from '../../components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/auth.service'
import { handleApiError } from '../../services/api'

export const Route = createFileRoute('/_doctor/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dados do perfil
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setEmail(user.email || '');
      setTelefone(user.telefone || '');
      setEndereco(user.endereco || '');
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updatedUser = await authService.updatePerfil({
        nome,
        telefone,
        endereco,
      });

      setUser(updatedUser);
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    // Container principal da página (igual à imagem nova)
    <div className="container mx-auto max-w-5xl p-6 py-10">
      
      {/* Título Principal */}
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Configurações
      </h1>

      {/* 3. Sistema de Abas (Tabs) do shadcn (ADICIONADO DE VOLTA) */}
      <Tabs defaultValue="perfil" className="w-full">
        
        {/* Lista de Abas (Navegação Secundária) */}
        <TabsList className="mb-6">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="disponibilidade">Disponibilidade</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="outros">Outros</TabsTrigger>
        </TabsList>

        {/* Conteúdo da Aba "Perfil" (ADICIONADO DE VOLTA) */}
        <TabsContent value="perfil">
          {/* O Card (cartão branco) ADICIONADO DE VOLTA */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize os seus dados pessoais e de contacto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
                  {success}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Dr. Ricardo Almeida"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      placeholder="email@exemplo.com"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Endereço</h3>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Input
                      id="endereco"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Rua, número, complemento, bairro, cidade - UF"
                      disabled={loading}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Conteúdo das Outras Abas (vazio por enquanto) */}
        <TabsContent value="disponibilidade">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade</CardTitle>
              <CardDescription>
                Defina os seus horários de atendimento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Em breve...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Escolha como deseja ser notificado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Em breve...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outros">
          <Card>
            <CardHeader>
              <CardTitle>Outros</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Em breve...</p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}

