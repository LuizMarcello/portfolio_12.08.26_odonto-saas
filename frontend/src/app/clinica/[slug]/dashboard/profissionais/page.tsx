import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Edit2, Phone, Mail, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function DentistsListPage({
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

  // 3. Fetch dentists belonging to this clinic
  const dentists = await prisma.dentist.findMany({
    where: {
      clinics: {
        some: { id: clinic.id },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-600" />
            Profissionais
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os dentistas e cirurgiões vinculados à sua clínica.
          </p>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
          <Link href={`/clinica/${slug}/dashboard/profissionais/novo`}>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Profissional
          </Link>
        </Button>
      </div>

      {/* List Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Equipe Médica</CardTitle>
          <CardDescription>Lista completa de cirurgiões-dentistas credenciados.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {dentists.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-2">
              <p className="font-semibold text-lg">Nenhum profissional cadastrado.</p>
              <p className="text-sm">Clique em "Cadastrar Profissional" para começar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>CRO</TableHead>
                  <TableHead>Contatos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dentists.map((dentist) => (
                  <TableRow key={dentist.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                        {dentist.name.charAt(0) + (dentist.name.split(" ")[1]?.charAt(0) || "")}
                      </Avatar>
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50 block">{dentist.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{dentist.specialty}</TableCell>
                    <TableCell className="font-mono text-xs">{dentist.cro || "Não informado"}</TableCell>
                    <TableCell className="space-y-1 text-xs">
                      {dentist.phone && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {dentist.phone}
                        </div>
                      )}
                      {dentist.email && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {dentist.email}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {dentist.active ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/clinica/${slug}/dashboard/profissionais/${dentist.id}`}>
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
