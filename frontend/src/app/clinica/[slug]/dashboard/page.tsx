import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";
import { DashboardClientPage } from "./dashboard-client";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ClinicDashboardPage({
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

  // 2. Fetch the clinic with dentists, patients and appointments
  const clinic = await prisma.clinic.findUnique({
    where: { slug },
    include: {
      dentists: true,
      patients: true,
      appointments: {
        include: {
          patient: true,
          dentist: true,
        },
      },
    },
  });

  const userClinicId = (session.user as any).clinicId;
  if (!clinic || userClinicId !== clinic.id) {
    redirect("/dashboard");
  }

  // 3. Compute stats
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  // Appointments today
  const appointmentsToday = clinic.appointments.filter(
    (app) => app.dateTime >= todayStart && app.dateTime <= todayEnd
  );

  // Future appointments
  const nextAppointments = clinic.appointments
    .filter((app) => app.dateTime >= now && app.status !== "CANCELLED")
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
    .slice(0, 5);

  // Total patients
  const totalPatients = clinic.patients.length;

  // Dentists count
  const totalDentists = clinic.dentists.length;

  // Cancelled appointments count
  const cancelledCount = clinic.appointments.filter(
    (app) => app.status === "CANCELLED"
  ).length;

  // Compute available slots today for each dentist
  // Shift slots: 08:00, 09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00, 17:00
  const standardHours = [8, 9, 10, 11, 13, 14, 15, 16, 17];
  const availableSlotsToday: { dentistName: string; time: string }[] = [];

  clinic.dentists.forEach((dentist) => {
    const occupiedHours = appointmentsToday
      .filter((app) => app.dentistId === dentist.id && app.status !== "CANCELLED")
      .map((app) => app.dateTime.getHours());

    standardHours.forEach((hour) => {
      // Se a hora for no passado hoje, ignora
      const slotTime = new Date(now);
      slotTime.setHours(hour, 0, 0, 0);
      if (slotTime < now) return;

      if (!occupiedHours.includes(hour)) {
        availableSlotsToday.push({
          dentistName: dentist.name,
          time: `${hour.toString().padStart(2, "0")}:00`,
        });
      }
    });
  });

  const displayAvailableSlots = availableSlotsToday.slice(0, 6);

  return (
    <DashboardClientPage
      clinicName={clinic.name}
      clinicCredits={clinic.credits}
      totalPatients={totalPatients}
      totalDentists={totalDentists}
      cancelledCount={cancelledCount}
      appointmentsToday={appointmentsToday.map((app) => ({
        id: app.id,
        time: app.dateTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        patientName: app.patient.name,
        dentistName: app.dentist.name,
        status: app.status,
      }))}
      nextAppointments={nextAppointments.map((app) => ({
        id: app.id,
        dateTime: app.dateTime.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
        patientName: app.patient.name,
        dentistName: app.dentist.name,
        status: app.status,
      }))}
      dentists={clinic.dentists.map((d) => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty,
      }))}
      availableSlotsToday={displayAvailableSlots}
    />
  );
}
