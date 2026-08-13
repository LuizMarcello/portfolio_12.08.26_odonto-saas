import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const clinicId = (session.user as any).clinicId;

    const dentist = await prisma.dentist.findFirst({
      where: {
        id,
        clinics: {
          some: { id: clinicId },
        },
      },
      include: {
        clinics: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!dentist) {
      return NextResponse.json({ error: "Profissional não encontrado nesta clínica." }, { status: 404 });
    }

    return NextResponse.json(dentist);
  } catch (error: any) {
    console.error("Erro ao buscar profissional:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
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
        { error: "Acesso negado. Apenas administradores podem atualizar profissionais." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, specialty, cro, phone, email, photo, active, workingHours } = body;

    // Garante que o profissional pertence à clínica do administrador
    const existingDentist = await prisma.dentist.findFirst({
      where: {
        id,
        clinics: {
          some: { id: clinicId },
        },
      },
    });

    if (!existingDentist) {
      return NextResponse.json({ error: "Profissional não pertence a esta clínica." }, { status: 404 });
    }

    const updatedDentist = await prisma.dentist.update({
      where: { id },
      data: {
        name,
        specialty,
        cro: cro || null,
        phone: phone || null,
        email: email || null,
        photo: photo || null,
        active: active !== undefined ? active : true,
        workingHours: workingHours || undefined,
      },
    });

    return NextResponse.json({ success: true, dentist: updatedDentist });
  } catch (error: any) {
    console.error("Erro ao atualizar profissional:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
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
        { error: "Acesso negado. Apenas administradores podem remover profissionais." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Valida se o profissional pertence a esta clínica
    const existingDentist = await prisma.dentist.findFirst({
      where: {
        id,
        clinics: {
          some: { id: clinicId },
        },
      },
    });

    if (!existingDentist) {
      return NextResponse.json({ error: "Profissional não encontrado nesta clínica." }, { status: 404 });
    }

    // Ação não destrutiva: Em vez de excluir fisicamente o profissional (já que ele pode trabalhar
    // em outras clínicas), apenas o desconectamos desta clínica específica.
    await prisma.dentist.update({
      where: { id },
      data: {
        clinics: {
          disconnect: { id: clinicId },
        },
      },
    });

    return NextResponse.json({ success: true, message: "Profissional desassociado com sucesso." });
  } catch (error: any) {
    console.error("Erro ao remover profissional:", error);
    return NextResponse.json({ error: "Erro interno no servidor ao tentar remover." }, { status: 500 });
  }
}
