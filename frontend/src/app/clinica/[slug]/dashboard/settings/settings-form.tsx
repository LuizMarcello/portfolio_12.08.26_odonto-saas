"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Building2, Phone, Mail, MapPin, ShieldAlert, Sparkles, Clock, Globe } from "lucide-react";

interface SettingsFormProps {
  initialClinicData: {
    id: string;
    name: string;
    slug: string;
    cnpj: string | null;
    address: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    logo: string | null;
    workingHours: any;
    bookingSettings: any;
    patientDisplayInfo: any;
  };
}

export function SettingsForm({ initialClinicData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);

  // General fields state
  const [name, setName] = useState(initialClinicData.name);
  const [cnpj, setCnpj] = useState(initialClinicData.cnpj || "");
  const [address, setAddress] = useState(initialClinicData.address || "");
  const [phone, setPhone] = useState(initialClinicData.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialClinicData.whatsapp || "");
  const [email, setEmail] = useState(initialClinicData.email || "");

  // Custom visual configurations
  const [logo, setLogo] = useState(initialClinicData.logo || "");

  // Working Hours (default template fallback)
  const defaultWorkingHours = {
    weekday: "08:00 - 18:00",
    saturday: "08:00 - 12:00",
    sunday: "Fechado",
  };
  const currentWorkingHours = initialClinicData.workingHours || defaultWorkingHours;
  const [weekdayHours, setWeekdayHours] = useState(currentWorkingHours.weekday || "");
  const [saturdayHours, setSaturdayHours] = useState(currentWorkingHours.saturday || "");
  const [sundayHours, setSundayHours] = useState(currentWorkingHours.sunday || "");

  // Booking Settings (default template fallback)
  const defaultBookingSettings = {
    slotInterval: "30", // em minutos
    minNoticeHours: "2", // antecedência mínima em horas
    allowSameDay: true,
  };
  const currentBookingSettings = initialClinicData.bookingSettings || defaultBookingSettings;
  const [slotInterval, setSlotInterval] = useState(currentBookingSettings.slotInterval || "30");
  const [minNoticeHours, setMinNoticeHours] = useState(currentBookingSettings.minNoticeHours || "2");
  const [allowSameDay, setAllowSameDay] = useState(
    currentBookingSettings.allowSameDay !== undefined ? currentBookingSettings.allowSameDay : true
  );

  // Patient Display settings
  const defaultDisplayInfo = {
    welcomeMessage: "Agende sua avaliação conosco agora mesmo!",
    showPhone: true,
    showAddress: true,
  };
  const currentDisplayInfo = initialClinicData.patientDisplayInfo || defaultDisplayInfo;
  const [welcomeMessage, setWelcomeMessage] = useState(currentDisplayInfo.welcomeMessage || "");
  const [showPhone, setShowPhone] = useState(
    currentDisplayInfo.showPhone !== undefined ? currentDisplayInfo.showPhone : true
  );
  const [showAddress, setShowAddress] = useState(
    currentDisplayInfo.showAddress !== undefined ? currentDisplayInfo.showAddress : true
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const workingHoursObj = {
      weekday: weekdayHours,
      saturday: saturdayHours,
      sunday: sundayHours,
    };

    const bookingSettingsObj = {
      slotInterval,
      minNoticeHours,
      allowSameDay,
    };

    const displayInfoObj = {
      welcomeMessage,
      showPhone,
      showAddress,
    };

    try {
      const response = await fetch("/api/clinics", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          cnpj,
          address,
          phone,
          whatsapp,
          email,
          logo,
          workingHours: workingHoursObj,
          bookingSettings: bookingSettingsObj,
          patientDisplayInfo: displayInfoObj,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar as configurações.");
      }

      toast.success("Configurações atualizadas com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro ao salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-teal-600" />
          Configurações da Clínica
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os dados visíveis, horários, regras de agendamento e informações exibidas para os pacientes.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList className="bg-muted/50 border">
            <TabsTrigger value="geral" className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              Gerais & Contato
            </TabsTrigger>
            <TabsTrigger value="atendimento" className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Atendimento & Regras
            </TabsTrigger>
            <TabsTrigger value="paciente" className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" />
              Visualização Paciente
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: GERAIS E CONTATO */}
          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados Básicos e Contato</CardTitle>
                <CardDescription>Informações fundamentais de contato e documentação da sua clínica.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome da Clínica</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CNPJ</label>
                    <Input
                      placeholder="Ex: 00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-zinc-400" />
                      Telefone
                    </label>
                    <Input
                      placeholder="Ex: (11) 4002-8922"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-zinc-400" />
                      WhatsApp
                    </label>
                    <Input
                      placeholder="Ex: (11) 99999-9999"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-zinc-400" />
                      E-mail da Clínica
                    </label>
                    <Input
                      type="email"
                      placeholder="clinica@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                    Endereço Completo
                  </label>
                  <Input
                    placeholder="Rua, Número, Bairro, Cidade - Estado, CEP"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: ATENDIMENTO E REGRAS */}
          <TabsContent value="atendimento">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Horários e Agendamento</CardTitle>
                <CardDescription>Configure os horários de funcionamento e regras para marcação de consultas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Working Hours */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    <Clock className="h-4 w-4 text-teal-600" />
                    Horários de Funcionamento
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Segunda a Sexta</label>
                      <Input value={weekdayHours} onChange={(e) => setWeekdayHours(e.target.value)} placeholder="Ex: 08:00 - 18:00" disabled={loading} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Sábado</label>
                      <Input value={saturdayHours} onChange={(e) => setSaturdayHours(e.target.value)} placeholder="Ex: 08:00 - 12:00" disabled={loading} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Domingo</label>
                      <Input value={sundayHours} onChange={(e) => setSundayHours(e.target.value)} placeholder="Ex: Fechado" disabled={loading} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Booking settings */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    <ShieldAlert className="h-4 w-4 text-teal-600" />
                    Regras de Agendamento Online
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Intervalo entre Consultas (Minutos)</label>
                      <Input
                        type="number"
                        min="10"
                        max="180"
                        value={slotInterval}
                        onChange={(e) => setSlotInterval(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Antecedência Mínima para Marcar (Horas)</label>
                      <Input
                        type="number"
                        min="0"
                        max="72"
                        value={minNoticeHours}
                        onChange={(e) => setMinNoticeHours(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-zinc-50/50 mt-4">
                    <div className="space-y-0.5">
                      <label className="text-sm font-semibold">Permitir Agendar no Mesmo Dia?</label>
                      <p className="text-xs text-muted-foreground">Se ativo, pacientes podem marcar consultas hoje mesmo se houver janelas livres.</p>
                    </div>
                    <Switch checked={allowSameDay} onCheckedChange={setAllowSameDay} disabled={loading} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: VISUALIZAÇÃO PACIENTE */}
          <TabsContent value="paciente">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Exibidas ao Paciente</CardTitle>
                <CardDescription>Personalize como sua clínica é vista pelos pacientes na página de agendamentos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Logotipo da Clínica (URL)</label>
                  <Input
                    placeholder="https://exemplo.com/logo.png"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">Insira uma URL pública da imagem do seu logotipo para carregar nos agendamentos.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensagem de Boas-vindas</label>
                  <Input
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder="Ex: Agende sua avaliação..."
                    disabled={loading}
                  />
                </div>

                <Separator className="my-2" />

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Informações de Contato Visíveis:</h4>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-zinc-50/50">
                    <div className="space-y-0.5">
                      <label className="text-sm font-semibold">Exibir Telefone no Agendamento</label>
                      <p className="text-xs text-muted-foreground">Mostra os contatos telefônicos na página pública.</p>
                    </div>
                    <Switch checked={showPhone} onCheckedChange={setShowPhone} disabled={loading} />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-zinc-50/50">
                    <div className="space-y-0.5">
                      <label className="text-sm font-semibold">Exibir Endereço no Agendamento</label>
                      <p className="text-xs text-muted-foreground">Mostra o endereço físico para facilidade do paciente.</p>
                    </div>
                    <Switch checked={showAddress} onCheckedChange={setShowAddress} disabled={loading} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Configurações"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
