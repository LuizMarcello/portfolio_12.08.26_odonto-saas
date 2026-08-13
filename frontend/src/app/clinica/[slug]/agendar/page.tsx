import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { BookingForm } from "./booking-form";
import { Toaster } from "sonner";

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;

  const clinic = await prisma.clinic.findUnique({
    where: { slug },
    include: {
      dentists: true,
    },
  });

  if (!clinic) {
    notFound();
  }

  const clinicId = clinic.id;
  const clinicName = clinic.name;
  const clinicDentists = clinic.dentists.map((d) => ({
    id: d.id,
    name: d.name,
    specialty: d.specialty,
  }));

  // Server Action que será executada no submit do formulário
  async function handleScheduleAction(data: {
    patientName: string;
    patientEmail: string;
    dentistId: string;
    date: Date;
    time: string;
  }) {
    "use server";
    
    const { patientName, patientEmail, dentistId, date, time } = data;
    if (!patientName || !dentistId || !date || !time) {
      throw new Error("Dados obrigatórios ausentes.");
    }

    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);

    await prisma.$transaction(async (tx) => {
      let patient = await tx.patient.findFirst({
        where: {
          clinicId: clinicId,
          email: patientEmail,
        },
      });

      if (!patient) {
        patient = await tx.patient.create({
          data: {
            name: patientName,
            email: patientEmail,
            clinicId: clinicId,
          },
        });
      }

      await tx.appointment.create({
        data: {
          dateTime,
          clinicId: clinicId,
          dentistId,
          patientId: patient.id,
          status: "PENDING",
        },
      });
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-tr from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <BookingForm
        clinicId={clinicId}
        clinicName={clinicName}
        dentists={clinicDentists}
        onSubmit={handleScheduleAction}
      />
      <Toaster position="top-right" richColors />
    </div>
  );
}
