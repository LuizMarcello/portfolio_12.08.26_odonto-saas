import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const clinicId = (session.user as any).clinicId;
    if (!clinicId) {
      return NextResponse.json({ error: "Nenhuma clínica associada a este usuário" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const dentistId = searchParams.get("dentistId");
    const room = searchParams.get("room");
    const status = searchParams.get("status");

    // Construção dinâmica de filtros no Prisma
    const whereClause: any = {
      clinicId,
    };

    if (startDateParam || endDateParam) {
      whereClause.dateTime = {};
      if (startDateParam) {
        whereClause.dateTime.gte = new Date(startDateParam);
      }
      if (endDateParam) {
        whereClause.dateTime.lte = new Date(endDateParam);
      }
    }

    if (dentistId && dentistId !== "all") {
      whereClause.dentistId = dentistId;
    }

    if (room && room !== "all") {
      whereClause.room = room;
    }

    if (status && status !== "all") {
      whereClause.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: { name: true, phone: true, email: true },
        },
        dentist: {
          select: { name: true, specialty: true },
        },
      },
      orderBy: { dateTime: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error: any) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
