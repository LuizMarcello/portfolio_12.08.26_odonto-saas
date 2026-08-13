"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  Clock,
  DollarSign,
  UserCheck,
  ArrowLeft,
  Trash2,
  FileText,
} from "lucide-react";

interface ServiceFormProps {
  slug: string;
  dentists: {
    id: string;
    name: string;
    specialty: string;
  }[];
  initialServiceData?: {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    active: boolean;
    dentists: string[]; // IDs dos dentistas habilitados
  };
}

export function ServiceForm({ slug, dentists, initialServiceData }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!initialServiceData;

  const [loading, setLoading] = useState(false);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(0); // 0: initial, 1, 2, 3: confirm (Rule 1)

  // Fields state
  const [name, setName] = useState(initialServiceData?.name || "");
  const [description, setDescription] = useState(initialServiceData?.description || "");
  const [duration, setDuration] = useState(initialServiceData?.duration.toString() || "30");
  const [price, setPrice] = useState(initialServiceData?.price.toString() || "100");
  const [active, setActive] = useState(
    initialServiceData?.active !== undefined ? initialServiceData.active : true
  );
  const [selectedDentists, setSelectedDentists] = useState<string[]>(
    initialServiceData?.dentists || []
  );

  const suggestedServices = [
    "Avaliação odontológica",
    "Limpeza",
    "Clareamento",
    "Restauração",
    "Implante",
    "Extração",
    "Ortodontia",
  ];

  const handleDentistToggle = (dentistId: string) => {
    setSelectedDentists((prev) =>
      prev.includes(dentistId)
        ? prev.filter((id) => id !== dentistId)
        : [...prev, dentistId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !duration || !price) {
      toast.error("Nome, duração e preço são obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing ? `/api/services/${initialServiceData.id}` : "/api/services";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          duration: parseInt(duration),
          price: parseFloat(price),
          active,
          dentistIds: selectedDentists,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar o serviço.");
      }

      toast.success(
        isEditing
          ? "Serviço atualizado com sucesso!"
          : "Serviço cadastrado com sucesso!"
      );
      router.push(`/clinica/${slug}/dashboard/servicos`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Erro de conexão com a API.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialServiceData) return;

    // Rule 1: Confirm 3 times consecutively before performing critical action
    if (deleteConfirmStep < 3) {
      const nextStep = deleteConfirmStep + 1;
      setDeleteConfirmStep(nextStep);
      toast.warning(`Confirmação de segurança: Etapa ${nextStep}/3 para excluir serviço.`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/services/${initialServiceData.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao excluir o serviço.");
      }

      toast.success("Serviço excluído da clínica com sucesso!");
      router.push(`/clinica/${slug}/dashboard/servicos`);
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
        <Button variant="ghost" size="sm" onClick={() => router.push(`/clinica/${slug}/dashboard/servicos`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Lista
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Package className="h-6 w-6 text-teal-600" />
          {isEditing ? `Editar Serviço: ${name}` : "Cadastrar Novo Serviço"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? "Atualize as informações cadastrais e as regras de agendamento deste procedimento."
            : "Insira os dados do novo procedimento e selecione os dentistas habilitados a realizá-lo."}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Cadastrais do Procedimento</CardTitle>
            <CardDescription>Nome, preço e duração recomendada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Serviço</label>
                <div className="flex gap-2">
                  <Input value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} placeholder="Ex: Limpeza, Ortodontia..." className="flex-1" />
                </div>
                {/* Suggested template links */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {suggestedServices.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setName(suggestion)}
                      className="text-[10px] px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-md transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-zinc-400" />
                  Descrição Breve
                </label>
                <Input
                  placeholder="Ex: Remoção de tártaro e placa bacteriana"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  Duração Estimada (Minutos)
                </label>
                <Input
                  type="number"
                  min="5"
                  max="480"
                  placeholder="Ex: 45"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                  Preço Base (R$)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 150.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-zinc-50/50">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold">Serviço Disponível para Agendamento?</label>
                <p className="text-xs text-muted-foreground">Inativar este serviço impede que pacientes o agendem online.</p>
              </div>
              <Switch checked={active} onCheckedChange={setActive} disabled={loading} />
            </div>
          </CardContent>
        </Card>

        {/* Enabled dentists section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-teal-600" />
              Profissionais Habilitados
            </CardTitle>
            <CardDescription>Selecione quais dentistas da equipe realizam este procedimento na clínica.</CardDescription>
          </CardHeader>
          <CardContent>
            {dentists.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Nenhum profissional ativo cadastrado na clínica.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {dentists.map((dentist) => (
                  <div
                    key={dentist.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-zinc-50 transition cursor-pointer"
                    onClick={() => handleDentistToggle(dentist.id)}
                  >
                    <Checkbox
                      checked={selectedDentists.includes(dentist.id)}
                      onCheckedChange={() => handleDentistToggle(dentist.id)}
                      id={dentist.id}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="space-y-0.5">
                      <label htmlFor={dentist.id} className="text-sm font-semibold text-zinc-900 cursor-pointer">
                        {dentist.name}
                      </label>
                      <p className="text-xs text-muted-foreground">{dentist.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action buttons */}
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
                  ? "Excluir Serviço"
                  : `Confirmar Clique (${deleteConfirmStep}/3)`}
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/clinica/${slug}/dashboard/servicos`)}
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
                "Salvar Serviço"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
