import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Se o usuário não possui uma clínica cadastrada, força o redirecionamento para o setup
  const clinicId = (session.user as any).clinicId;
  if (!clinicId) {
    redirect("/setup-clinic");
  }

  // Busca o slug da clínica do usuário para redirecionar para a URL dinâmica correspondente
  const userClinic = await prisma.clinic.findUnique({
    where: { id: clinicId },
    select: { slug: true },
  });

  if (userClinic?.slug) {
    redirect(`/clinica/${userClinic.slug}/dashboard`);
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
      <SidebarInset className="bg-muted/30">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
