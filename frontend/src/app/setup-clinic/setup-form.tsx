"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Building2, Globe } from "lucide-react";

export function SetupClinicForm({ userName }: { userName: string }) {
  const [loading, setLoading] = useState(false);
  const [clinicName, setClinicName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  // Helper to format string into a URL-friendly slug
  const formatSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-") // Replace multiple - with single -
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setClinicName(val);
    if (!isSlugEdited) {
      setSlug(formatSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugEdited(true);
    setSlug(formatSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clinicName || !slug) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/clinics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: clinicName,
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar a clínica.");
      }

      toast.success("Clínica cadastrada com sucesso!");
      
      // Força um recarregamento da página para atualizar a sessão e mandar pro dashboard da clínica
      window.location.href = `/clinica/${slug}/dashboard`;
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro ao processar o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-tr from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <Card className="w-full max-w-md border border-border/40 shadow-xl bg-card/60 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-teal-600" />
            Configurar Sua Clínica
          </CardTitle>
          <CardDescription>
            Olá {userName}, configure os dados iniciais da sua clínica odontológica para acessar o painel.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Clinic Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Clínica</label>
              <Input
                type="text"
                placeholder="Ex: Sorriso Perfeito"
                value={clinicName}
                onChange={handleNameChange}
                required
                disabled={loading}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Endereço da Clínica (Slug)</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ex: sorriso-perfeito"
                  value={slug}
                  onChange={handleSlugChange}
                  required
                  disabled={loading}
                  className="pl-8"
                />
                <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Seu endereço de agendamento público será: <br />
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  localhost:3000/clinica/{slug || "seu-slug"}/agendar
                </span>
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full font-bold bg-teal-600 hover:bg-teal-700 text-white" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Criar Clínica e Acessar Painel"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
