import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Plus, Edit2, Clock, DollarSign, Users } from "lucide-react";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ServicesListPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  // 1. Session Check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // 2. Fetch Clinic details to verify membership
  const clinic = await prisma.clinic.findUnique({
    where: { slug },
  });

  const userClinicId = (session.user as any).clinicId;
  if (!clinic || userClinicId !== clinic.id) {
    redirect("/dashboard");
  }

  // 3. Fetch services belonging to this clinic
  const services = await prisma.service.findMany({
    where: { clinicId: clinic.id },
    include: {
      _count: {
        select: { dentists: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Package className="h-6 w-6 text-teal-600" />
            Serviços & Procedimentos
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os tratamentos disponíveis na sua clínica para agendamento.
          </p>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
          <Link href={`/clinica/${slug}/dashboard/servicos/novo`}>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Serviço
          </Link>
        </Button>
      </div>

      {/* List Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Procedimentos Cadastrados</CardTitle>
          <CardDescription>Lista completa de serviços oferecidos aos pacientes.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {services.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-2">
              <p className="font-semibold text-lg">Nenhum serviço cadastrado.</p>
              <p className="text-sm">Cadastre procedimentos como Limpeza, Clareamento ou Ortodontia para agendamentos online.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Preço Base</TableHead>
                  <TableHead>Profissionais Aptos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      <span className="font-bold text-zinc-900 dark:text-zinc-50 block">{service.name}</span>
                      {service.description && (
                        <span className="text-xs text-muted-foreground block truncate max-w-[250px]">{service.description}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1 text-zinc-600">
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration} min
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
                      {formatPrice(service.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {service._count.dentists} habilitado(s)
                      </div>
                    </TableCell>
                    <TableCell>
                      {service.active ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/clinica/${slug}/dashboard/servicos/${service.id}`}>
                          <Edit2 className="h-4 w-4 text-teal-600" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
