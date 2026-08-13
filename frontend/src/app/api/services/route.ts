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
      return NextResponse.json({ error: "Nenhuma clínica associada" }, { status: 400 });
    }

    const services = await prisma.service.findMany({
      where: { clinicId },
      include: {
        dentists: {
          select: { id: true, name: true, specialty: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(services);
  } catch (error: any) {
    console.error("Erro ao buscar serviços:", error);
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
        { error: "Acesso negado. Apenas administradores podem gerenciar serviços." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, duration, price, active, dentistIds } = body;

    if (!name || !duration || price === undefined) {
      return NextResponse.json(
        { error: "Nome, duração e preço base são obrigatórios." },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        duration: parseInt(duration),
        price: parseFloat(price),
        active: active !== undefined ? active : true,
        clinicId,
        dentists: dentistIds && dentistIds.length > 0
          ? {
              connect: dentistIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json({ error: "Erro interno no servidor ao criar serviço." }, { status: 500 });
  }
}
