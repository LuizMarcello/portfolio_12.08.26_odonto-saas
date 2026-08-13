"use client";

import { useState } from "react";
import {
  Users,
  Calendar,
  UserCheck,
  Ban,
  Clock,
  Sparkles,
  Search,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogoutButton } from "@/components/auth/logout-button";

interface DashboardProps {
  clinicName: string;
  clinicCredits: number;
  totalPatients: number;
  totalDentists: number;
  cancelledCount: number;
  appointmentsToday: {
    id: string;
    time: string;
    patientName: string;
    dentistName: string;
    status: string;
  }[];
  nextAppointments: {
    id: string;
    dateTime: string;
    patientName: string;
    dentistName: string;
    status: string;
  }[];
  dentists: {
    id: string;
    name: string;
    specialty: string;
  }[];
  availableSlotsToday: {
    dentistName: string;
    time: string;
  }[];
}

export function DashboardClientPage({
  clinicName,
  clinicCredits,
  totalPatients,
  totalDentists,
  cancelledCount,
  appointmentsToday,
  nextAppointments,
  dentists,
  availableSlotsToday,
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Confirmado</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary" className="bg-zinc-100 text-zinc-700">Pendente</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-xl font-semibold">Painel - {clinicName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarFallback className="bg-teal-100 text-teal-600 text-xs font-bold">
                OP
              </AvatarFallback>
            </Avatar>
          </div>
          <LogoutButton variant="outline" size="sm" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Indicators Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card: Total Patients */}
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pacientes Cadastrados</p>
                <p className="text-3xl font-extrabold mt-2 text-zinc-900">{totalPatients}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Dentists */}
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profissionais Ativos</p>
                <p className="text-3xl font-extrabold mt-2 text-zinc-900">{totalDentists}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <UserCheck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Cancelations */}
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cancelamentos Totais</p>
                <p className="text-3xl font-extrabold mt-2 text-zinc-900">{cancelledCount}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <Ban className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Card: IA Credits */}
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Créditos de IA</p>
                <p className="text-3xl font-extrabold mt-2 text-zinc-900">{clinicCredits}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                <Sparkles className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Lists Row */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Appointments of Today */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Consultas Agendadas Hoje</CardTitle>
              <CardDescription>Visualização em tempo real dos pacientes de hoje.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {appointmentsToday.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma consulta agendada para hoje.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Horário</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Dentista</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointmentsToday.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-zinc-400" />
                          {app.time}
                        </TableCell>
                        <TableCell>{app.patientName}</TableCell>
                        <TableCell>{app.dentistName}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Available Slots Today */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Horários Livres (Hoje)</CardTitle>
              <CardDescription>Próximas janelas disponíveis para marcação imediata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableSlotsToday.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  Sem horários livres para o restante de hoje.
                </div>
              ) : (
                availableSlotsToday.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-zinc-50/50 hover:bg-zinc-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-600" />
                      <span className="font-bold text-sm text-zinc-800">{slot.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground max-w-[150px] truncate text-right">
                      {slot.dentistName}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Next Appointments */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Próximas Consultas</CardTitle>
              <CardDescription>Lista cronológica dos próximos compromissos da clínica.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {nextAppointments.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Sem próximos agendamentos programados.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Dentista</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nextAppointments.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium text-xs">
                          {app.dateTime}
                        </TableCell>
                        <TableCell>{app.patientName}</TableCell>
                        <TableCell>{app.dentistName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Dentists List */}
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Equipe Médica</CardTitle>
              <CardDescription>Profissionais cadastrados sob esta clínica.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dentists.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  Nenhum profissional cadastrado.
                </div>
              ) : (
                dentists.map((dentist) => (
                  <div key={dentist.id} className="flex items-center gap-3 p-3 border rounded-lg bg-zinc-50/50">
                    <Avatar className="h-9 w-9 bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      {dentist.name.charAt(0) + dentist.name.split(" ")[1]?.charAt(0)}
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900">{dentist.name}</h4>
                      <p className="text-xs text-muted-foreground">{dentist.specialty}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
