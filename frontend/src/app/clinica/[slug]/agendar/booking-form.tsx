"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Dentist {
  id: string;
  name: string;
  specialty: string;
}

interface BookingFormProps {
  clinicId: string;
  clinicName: string;
  dentists: Dentist[];
  onSubmit: (data: {
    patientName: string;
    patientEmail: string;
    dentistId: string;
    date: Date;
    time: string;
  }) => Promise<void>;
}

export function BookingForm({ clinicId, clinicName, dentists, onSubmit }: BookingFormProps) {
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [dentistId, setDentistId] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientEmail || !dentistId || !date || !time) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        patientName,
        patientEmail,
        dentistId,
        date,
        time,
      });
      toast.success("Consulta agendada com sucesso!");
      setPatientName("");
      setPatientEmail("");
      setDentistId("");
      setDate(undefined);
      setTime("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao agendar a consulta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg border border-border/40 shadow-xl bg-card/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Agendar Consulta
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Agende sua consulta de forma rápida na clínica <strong>{clinicName}</strong>
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nome Completo
            </label>
            <Input
              type="text"
              placeholder="Digite seu nome completo"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              E-mail para Contato
            </label>
            <Input
              type="email"
              placeholder="seu.email@exemplo.com"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Selecione o Profissional
            </label>
            <Select onValueChange={setDentistId} value={dentistId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um dentista..." />
              </SelectTrigger>
              <SelectContent>
                {dentists.map((dentist) => (
                  <SelectItem key={dentist.id} value={dentist.id}>
                    {dentist.name} ({dentist.specialty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Data
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Horário
              </label>
              <Select onValueChange={setTime} value={time}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha a hora" />
                </SelectTrigger>
                <SelectContent>
                  {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full font-bold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirmando...
              </>
            ) : (
              "Confirmar Agendamento"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
