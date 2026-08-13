"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, UserCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface AppointmentsCalendarProps {
  slug: string;
  dentists: {
    id: string;
    name: string;
    specialty: string;
  }[];
}

interface Appointment {
  id: string;
  dateTime: string;
  status: string;
  room: string | null;
  patient: {
    name: string;
    phone: string | null;
    email: string | null;
  };
  dentist: {
    name: string;
    specialty: string;
  };
}

export function AppointmentsCalendar({ slug, dentists }: AppointmentsCalendarProps) {
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDentist, setSelectedDentist] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // Exemplo de salas/cadeiras fixas da clínica para filtrar
  const rooms = ["Consultório 1", "Consultório 2", "Cadeira 01", "Cadeira 02"];

  // Calcula o intervalo de datas baseado na visualização selecionada
  const getDateRange = () => {
    if (view === "day") {
      const start = new Date(currentDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(currentDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { locale: ptBR });
      const end = endOfWeek(currentDate, { locale: ptBR });
      return { start, end };
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return { start, end };
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    const { start, end } = getDateRange();

    try {
      const queryParams = new URLSearchParams({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        dentistId: selectedDentist,
        room: selectedRoom,
        status: selectedStatus,
      });

      const response = await fetch(`/api/appointments?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Falha ao carregar agendamentos.");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err: any) {
      toast.error(err.message || "Erro ao conectar-se ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [view, currentDate, selectedDentist, selectedRoom, selectedStatus]);

  // Navegação de datas
  const handlePrevious = () => {
    if (view === "day") setCurrentDate(subDays(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

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

  // Render do Modo Diário (Timeline de Horários)
  const renderDayView = () => {
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    return (
      <div className="space-y-3 mt-4 border rounded-xl overflow-hidden bg-card shadow-sm">
        {hours.map((hour) => {
          // Filtra consultas marcadas para esta hora específica
          const hourAppointments = appointments.filter((app) => {
            const date = new Date(app.dateTime);
            return date.getHours() === hour;
          });

          return (
            <div key={hour} className="flex border-b last:border-b-0 min-h-[70px] hover:bg-zinc-50/50 transition">
              <div className="w-20 flex items-center justify-center border-r bg-zinc-50 font-bold text-sm text-zinc-500">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="flex-1 p-3 flex flex-col gap-2 justify-center">
                {hourAppointments.length === 0 ? (
                  <span className="text-xs text-muted-foreground italic">Livre</span>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {hourAppointments.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 border rounded-lg bg-teal-50/30 hover:bg-teal-50/50 border-teal-100 transition shadow-xs"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-1.5">
                          <span className="font-bold text-sm text-zinc-900">{app.patient.name}</span>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1.5 flex-wrap">
                          <span>Dentista: {app.dentist.name}</span>
                          {app.room && (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-semibold text-[10px]">
                              {app.room}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render do Modo Semanal
  const renderWeekView = () => {
    const daysOfWeek = [];
    const start = startOfWeek(currentDate, { locale: ptBR });
    for (let i = 0; i < 6; i++) {
      daysOfWeek.push(addDays(start, i)); // Segunda a Sábado
    }

    return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mt-4">
        {daysOfWeek.map((day) => {
          const dayAppointments = appointments.filter((app) => isSameDay(new Date(app.dateTime), day));

          return (
            <Card key={day.toISOString()} className="bg-background flex flex-col min-h-[300px]">
              <CardHeader className="p-3 bg-zinc-50 border-b flex flex-col items-center">
                <span className="text-xs font-semibold uppercase text-zinc-500">
                  {format(day, "eee", { locale: ptBR })}
                </span>
                <span className="text-lg font-bold text-zinc-800">{format(day, "d")}</span>
              </CardHeader>
              <CardContent className="p-3 flex-1 space-y-2">
                {dayAppointments.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center italic py-10">Vazio</p>
                ) : (
                  dayAppointments.map((app) => (
                    <div key={app.id} className="p-2 border rounded text-xs bg-zinc-50 hover:bg-zinc-100 transition">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold truncate max-w-[90px]">{app.patient.name}</span>
                        <span className="text-[10px] font-semibold text-teal-600">
                          {format(new Date(app.dateTime), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{app.dentist.name}</p>
                      {app.room && (
                        <p className="text-[9px] mt-1 bg-zinc-200/50 rounded px-1 w-max text-zinc-600 font-semibold">
                          {app.room}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Render do Modo Mensal
  const renderMonthView = () => {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground py-12">
            Visualização de calendário mensal. Há um total de{" "}
            <span className="font-bold text-zinc-900">{appointments.length} agendamento(s)</span> para este mês.
            Use a visualização diária ou semanal para visualizar a grade completa de horários.
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Title & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-teal-600" />
            Central de Agendamentos
          </h1>
          <p className="text-sm text-muted-foreground">
            Grade completa de horários dos profissionais e salas.
          </p>
        </div>

        {/* Date Navigator & View Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 border rounded-lg p-1 bg-muted/30">
            <Button
              variant={view === "day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
              className="text-xs"
            >
              Diário
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className="text-xs"
            >
              Semanal
            </Button>
            <Button
              variant={view === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
              className="text-xs"
            >
              Mensal
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="text-xs px-3">
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <span className="font-bold text-sm text-zinc-800 min-w-[120px] text-center capitalize">
            {view === "day"
              ? format(currentDate, "dd 'de' MMMM", { locale: ptBR })
              : view === "week"
              ? `Semana ${format(currentDate, "w")}`
              : format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card className="bg-zinc-50/40 border-border/30">
        <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
          {/* Filter 1: Dentist */}
          <div className="space-y-1">
            <label className="text-xs font-semibold flex items-center gap-1">
              <UserCheck className="h-3 w-3 text-zinc-400" />
              Filtrar Profissional
            </label>
            <Select value={selectedDentist} onValueChange={setSelectedDentist}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Dentistas</SelectItem>
                {dentists.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter 2: Room */}
          <div className="space-y-1">
            <label className="text-xs font-semibold flex items-center gap-1">
              <Filter className="h-3 w-3 text-zinc-400" />
              Filtrar Sala / Cadeira
            </label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Salas</SelectItem>
                {rooms.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter 3: Status */}
          <div className="space-y-1">
            <label className="text-xs font-semibold flex items-center gap-1">
              <ShieldAlert className="h-3 w-3 text-zinc-400" />
              Filtrar Status
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
        </div>
      ) : (
        <>
          {view === "day" && renderDayView()}
          {view === "week" && renderWeekView()}
          {view === "month" && renderMonthView()}
        </>
      )}
    </div>
  );
}
