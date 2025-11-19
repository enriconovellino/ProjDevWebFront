import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

// Importa os componentes shadcn/ui que vamos usar
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Separator } from '../../components/ui/separator'
// Importações que vamos ADICIONAR DE VOLTA
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

// 1. Cria a rota para esta página
export const Route = createFileRoute('/_doctor/settings')({
  component: SettingsPage, // Define o componente da página
})

// 2. Define o componente da página (Versão CORRETA com Tabs)
function SettingsPage() {
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
              {/* O formulário (que já tínhamos) agora fica DENTRO do CardContent */}
              <form className="space-y-8">
                {/* Secção de Informações Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" placeholder="Dr. Ricardo Almeida" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="especialidade">Especialidade</Label>
                    <Input id="especialidade" placeholder="Cardiologia" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crm">CRM</Label>
                    <Input id="crm" placeholder="123456-SP" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" type="tel" placeholder="(11) 99999-9999" />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="ricardo.almeida@healthplus.com" />
                  </div>
                </div>

                <Separator />

                {/* Secção de Endereço da Clínica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Endereço da Clínica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="md:col-span-1 space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="01000-000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input id="endereco" placeholder="Av. Paulista" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input id="numero" placeholder="1000" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input id="complemento" placeholder="Sala 502" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input id="bairro" placeholder="Bela Vista" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input id="cidade" placeholder="São Paulo" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input id="estado" placeholder="SP" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>Salvar Alterações</Button>
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

