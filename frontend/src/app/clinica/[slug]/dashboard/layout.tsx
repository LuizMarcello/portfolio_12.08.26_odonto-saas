import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ClinicDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Busca a clínica pelo slug informado na URL
  const clinic = await prisma.clinic.findUnique({
    where: { slug },
  });

  // Se a clínica não existe ou o usuário logado não pertence a ela, redireciona de volta
  const userClinicId = (session.user as any).clinicId;
  if (!clinic || userClinicId !== clinic.id) {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
        clinicSlug={slug}
      />
      <SidebarInset className="bg-muted/30">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
