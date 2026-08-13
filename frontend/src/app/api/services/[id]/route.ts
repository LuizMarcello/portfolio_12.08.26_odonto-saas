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

    const service = await prisma.service.findFirst({
      where: {
        id,
        clinicId,
      },
      include: {
        dentists: {
          select: { id: true, name: true },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: any) {
    console.error("Erro ao buscar serviço:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
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
        { error: "Acesso negado. Apenas administradores podem atualizar serviços." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, duration, price, active, dentistIds } = body;

    const existingService = await prisma.service.findFirst({
      where: { id, clinicId },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Serviço não pertence a esta clínica." }, { status: 404 });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        description: description || null,
        duration: parseInt(duration),
        price: parseFloat(price),
        active: active !== undefined ? active : true,
        dentists: dentistIds
          ? {
              set: dentistIds.map((dId: string) => ({ id: dId })),
            }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, service: updatedService });
  } catch (error: any) {
    console.error("Erro ao atualizar serviço:", error);
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
        { error: "Acesso negado. Apenas administradores podem excluir serviços." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingService = await prisma.service.findFirst({
      where: { id, clinicId },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Serviço não encontrado nesta clínica." }, { status: 404 });
    }

    // Executa a remoção física do serviço, já que ele é exclusivo da clínica
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Serviço excluído com sucesso." });
  } catch (error: any) {
    console.error("Erro ao excluir serviço:", error);
    return NextResponse.json({ error: "Erro interno no servidor ao tentar excluir." }, { status: 500 });
  }
}
