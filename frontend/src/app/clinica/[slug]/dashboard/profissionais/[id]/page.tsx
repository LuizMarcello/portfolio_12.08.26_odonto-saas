import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { DentistForm } from "../dentist-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string; id: string }>;

export default async function EditDentistPage({
  params,
}: {
  params: Params;
}) {
  const { slug, id } = await params;

  // 1. Session check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // 2. Verify clinic membership
  const clinic = await prisma.clinic.findUnique({
    where: { slug },
  });

  const userClinicId = (session.user as any).clinicId;
  const userRole = (session.user as any).role;

  if (!clinic || userClinicId !== clinic.id) {
    redirect("/dashboard");
  }

  if (userRole !== "ADMIN") {
    redirect(`/clinica/${slug}/dashboard/profissionais`);
  }

  // 3. Fetch Dentist by ID
  const dentist = await prisma.dentist.findFirst({
    where: {
      id,
      clinics: {
        some: { id: clinic.id },
      },
    },
  });

  if (!dentist) {
    redirect(`/clinica/${slug}/dashboard/profissionais`);
  }

  // Serialize workingHours safely
  const serializedDentist = {
    ...dentist,
    workingHours: dentist.workingHours ? JSON.parse(JSON.stringify(dentist.workingHours)) : null,
  };

  return <DentistForm slug={slug} initialDentistData={serializedDentist} />;
}
