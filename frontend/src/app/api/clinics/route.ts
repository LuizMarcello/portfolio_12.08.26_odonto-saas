import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { name, slug } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 });
    }

    // Valida se o slug é uma string amigável (apenas letras, números e traços)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: "O slug deve conter apenas letras minúsculas, números e traços." },
        { status: 400 }
      );
    }

    // Verifica se já existe uma clínica com o mesmo slug
    const existingClinic = await prisma.clinic.findUnique({
      where: { slug },
    });

    if (existingClinic) {
      return NextResponse.json(
        { error: "Já existe uma clínica cadastrada com este slug/endereço." },
        { status: 400 }
      );
    }

    // Cria a clínica e associa o usuário em uma transação
    const clinic = await prisma.$transaction(async (tx) => {
      const createdClinic = await tx.clinic.create({
        data: {
          name,
          slug,
          credits: 100, // Créditos iniciais de IA gratuitos
        },
      });

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          clinicId: createdClinic.id,
          role: "ADMIN",
        },
      });

      return createdClinic;
    });

    return NextResponse.json({ success: true, clinic });
  } catch (error: any) {
    console.error("Erro ao cadastrar clínica:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
        { error: "Acesso negado. Apenas administradores da clínica podem salvar alterações." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      cnpj,
      address,
      phone,
      whatsapp,
      email,
      logo,
      workingHours,
      bookingSettings,
      patientDisplayInfo,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "O nome da clínica é obrigatório." }, { status: 400 });
    }

    const updatedClinic = await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        name,
        cnpj: cnpj || null,
        address: address || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        logo: logo || null,
        workingHours: workingHours || undefined,
        bookingSettings: bookingSettings || undefined,
        patientDisplayInfo: patientDisplayInfo || undefined,
      },
    });

    return NextResponse.json({ success: true, clinic: updatedClinic });
  } catch (error: any) {
    console.error("Erro ao atualizar clínica:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno ao salvar as configurações." },
      { status: 500 }
    );
  }
}

