import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ServiceForm } from "../service-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string; id: string }>;

export default async function EditServicePage({
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
    redirect(`/clinica/${slug}/dashboard/servicos`);
  }

  // 3. Fetch Service by ID
  const service = await prisma.service.findFirst({
    where: {
      id,
      clinicId: clinic.id,
    },
    include: {
      dentists: {
        select: { id: true },
      },
    },
  });

  if (!service) {
    redirect(`/clinica/${slug}/dashboard/servicos`);
  }

  // 4. Fetch active dentists to select habilitated professionals
  const dentists = await prisma.dentist.findMany({
    where: {
      clinics: {
        some: { id: clinic.id },
      },
      active: true,
    },
    select: {
      id: true,
      name: true,
      specialty: true,
    },
    orderBy: { name: "asc" },
  });

  const serializedService = {
    ...service,
    dentists: service.dentists.map((d) => d.id),
  };

  return <ServiceForm slug={slug} initialServiceData={serializedService} dentists={dentists} />;
}
