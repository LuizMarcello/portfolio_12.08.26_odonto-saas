import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ClinicSettingsPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  // 1. Session check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // 2. Fetch the clinic
  const clinic = await prisma.clinic.findUnique({
    where: { slug },
  });

  const userClinicId = (session.user as any).clinicId;
  const userRole = (session.user as any).role;

  if (!clinic || userClinicId !== clinic.id) {
    redirect("/dashboard");
  }

  if (userRole !== "ADMIN") {
    // Apenas admins podem configurar a clínica
    redirect(`/clinica/${slug}/dashboard`);
  }

  // Serialize JSON fields safely to avoid runtime errors on client components
  const serializedClinic = {
    ...clinic,
    workingHours: clinic.workingHours ? JSON.parse(JSON.stringify(clinic.workingHours)) : null,
    bookingSettings: clinic.bookingSettings ? JSON.parse(JSON.stringify(clinic.bookingSettings)) : null,
    patientDisplayInfo: clinic.patientDisplayInfo ? JSON.parse(JSON.stringify(clinic.patientDisplayInfo)) : null,
  };

  return <SettingsForm initialClinicData={serializedClinic} />;
}
