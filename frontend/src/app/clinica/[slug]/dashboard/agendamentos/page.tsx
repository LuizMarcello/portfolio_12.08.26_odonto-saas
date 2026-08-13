import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { AppointmentsCalendar } from "./appointments-calendar";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function AppointmentsPage({
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

  // 2. Fetch Clinic to verify membership
  const clinic = await prisma.clinic.findUnique({
    where: { slug },
  });

  const userClinicId = (session.user as any).clinicId;
  if (!clinic || userClinicId !== clinic.id) {
    redirect("/dashboard");
  }

  // 3. Fetch dentists to allow filtering in calendar UI
  const dentists = await prisma.dentist.findMany({
    where: {
      clinics: {
        some: { id: clinic.id },
      },
    },
    select: {
      id: true,
      name: true,
      specialty: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <AppointmentsCalendar
      slug={slug}
      dentists={dentists}
    />
  );
}
