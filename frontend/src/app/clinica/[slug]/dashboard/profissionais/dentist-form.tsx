"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Shield,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  Trash2,
} from "lucide-react";

interface DentistFormProps {
  slug: string;
  initialDentistData?: {
    id: string;
    name: string;
    specialty: string;
    cro: string | null;
    phone: string | null;
    email: string | null;
    photo: string | null;
    active: boolean;
    workingHours: any;
  };
}

export function DentistForm({ slug, initialDentistData }: DentistFormProps) {
  const router = useRouter();
  const isEditing = !!initialDentistData;

  const [loading, setLoading] = useState(false);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(0); // 0: initial, 1: click 1, 2: click 2, 3: final confirm (Rule 1)

  // Fields state
  const [name, setName] = useState(initialDentistData?.name || "");
  const [specialty, setSpecialty] = useState(initialDentistData?.specialty || "");
  const [cro, setCro] = useState(initialDentistData?.cro || "");
  const [phone, setPhone] = useState(initialDentistData?.phone || "");
  const [email, setEmail] = useState(initialDentistData?.email || "");
  const [photo, setPhoto] = useState(initialDentistData?.photo || "");
  const [active, setActive] = useState(
    initialDentistData?.active !== undefined ? initialDentistData.active : true
  );

  // Working Hours (weekday, Saturday, Sunday)
  const defaultWorkingHours = {
    weekday: "09:00 - 18:00",
    saturday: "09:00 - 13:00",
    sunday: "Fechado",
  };
  const currentWorkingHours = initialDentistData?.workingHours || defaultWorkingHours;
  const [weekdayHours, setWeekdayHours] = useState(currentWorkingHours.weekday || "");
  const [saturdayHours, setSaturdayHours] = useState(currentWorkingHours.saturday || "");
  const [sundayHours, setSundayHours] = useState(currentWorkingHours.sunday || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty) {
      toast.error("Nome e Especialidade são obrigatórios.");
      return;
    }

    setLoading(true);

    const workingHoursObj = {
      weekday: weekdayHours,
      saturday: saturdayHours,
      sunday: sundayHours,
    };

    try {
      const url = isEditing ? `/api/dentists/${initialDentistData.id}` : "/api/dentists";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          specialty,
          cro,
          phone,
          email,
          photo,
          active,
          workingHours: workingHoursObj,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar profissional.");
      }

      toast.success(
        isEditing
          ? "Profissional atualizado com sucesso!"
          : "Profissional cadastrado com sucesso!"
      );
      router.push(`/clinica/${slug}/dashboard/profissionais`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Erro de conexão ao processar requisição.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialDentistData) return;

    // Rule 1: Exigir verificação rigorosa em múltiplas etapas antes de exclusões.
    // Confirmar 3 vezes seguidas antes de desassociar.
    if (deleteConfirmStep < 3) {
      const nextStep = deleteConfirmStep + 1;
      setDeleteConfirmStep(nextStep);
      toast.warning(`Confirmação de segurança: Etapa ${nextStep}/3 para desvincular profissional.`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/dentists/${initialDentistData.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao desvincular o profissional.");
      }

      toast.success("Profissional desvinculado desta clínica com sucesso!");
      router.push(`/clinica/${slug}/dashboard/profissionais`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Erro ao tentar remover.");
      setDeleteConfirmStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/clinica/${slug}/dashboard/profissionais`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Lista
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <User className="h-6 w-6 text-teal-600" />
          {isEditing ? `Editar Profissional: ${name}` : "Cadastrar Novo Profissional"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? "Atualize as informações cadastrais e horários do profissional."
            : "Insira os dados cadastrais básicos e horários do novo profissional dentista."}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Profissionais e Contato</CardTitle>
            <CardDescription>Cadastre o CRO, especialidade e dados de comunicação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} placeholder="Ex: Dr. Roberto Silveira" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Especialidade Principal</label>
                <Input
                  placeholder="Ex: Ortodontia, Implantodontia..."
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-zinc-400" />
                  Número do CRO
                </label>
                <Input
                  placeholder="Ex: CRO-SP 12345"
                  value={cro}
                  onChange={(e) => setCro(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-zinc-400" />
                  Telefone
                </label>
                <Input
                  placeholder="Ex: (11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  E-mail
                </label>
                <Input
                  type="email"
                  placeholder="dentista@clinica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Link da Foto (URL)</label>
              <Input
                placeholder="https://exemplo.com/fotos/roberto.jpg"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-zinc-50/50">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold">Status de Cadastro</label>
                <p className="text-xs text-muted-foreground">Profissionais inativos não ficam visíveis para novos agendamentos.</p>
              </div>
              <Switch checked={active} onCheckedChange={setActive} disabled={loading} />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Horários de Atendimento nesta Clínica</CardTitle>
            <CardDescription>Configure a escala de atendimento semanal deste profissional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  Segunda a Sexta
                </label>
                <Input value={weekdayHours} onChange={(e) => setWeekdayHours(e.target.value)} placeholder="Ex: 09:00 - 18:00" disabled={loading} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  Sábado
                </label>
                <Input value={saturdayHours} onChange={(e) => setSaturdayHours(e.target.value)} placeholder="Ex: 09:00 - 13:00" disabled={loading} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  Domingo
                </label>
                <Input value={sundayHours} onChange={(e) => setSundayHours(e.target.value)} placeholder="Ex: Fechado" disabled={loading} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-4 flex-wrap">
          <div>
            {isEditing && (
              <Button
                type="button"
                variant={deleteConfirmStep > 0 ? "destructive" : "outline"}
                onClick={handleDelete}
                disabled={loading}
                className="font-bold flex items-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                {deleteConfirmStep === 0
                  ? "Remover Profissional"
                  : `Confirmar Clique (${deleteConfirmStep}/3)`}
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/clinica/${slug}/dashboard/profissionais`)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Profissional"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
