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

    const dentists = await prisma.dentist.findMany({
      where: {
        clinics: {
          some: { id: clinicId },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(dentists);
  } catch (error: any) {
    console.error("Erro ao buscar profissionais:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const clinicId = (session.user as any).clinicId;
    const role = (session.user as any).role;

    if (!clinicId || role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem cadastrar profissionais." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, specialty, cro, phone, email, photo, active, workingHours } = body;

    if (!name || !specialty) {
      return NextResponse.json({ error: "Nome e especialidade são obrigatórios" }, { status: 400 });
    }

    const dentist = await prisma.dentist.create({
      data: {
        name,
        specialty,
        cro: cro || null,
        phone: phone || null,
        email: email || null,
        photo: photo || null,
        active: active !== undefined ? active : true,
        workingHours: workingHours || undefined,
        clinics: {
          connect: { id: clinicId },
        },
      },
    });

    return NextResponse.json({ success: true, dentist });
  } catch (error: any) {
    console.error("Erro ao cadastrar profissional:", error);
    return NextResponse.json({ error: "Erro interno no servidor ao cadastrar." }, { status: 500 });
  }
}
