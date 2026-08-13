import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get("polar-signature");

    if (!signature) {
      return NextResponse.json({ error: "Assinatura ausente" }, { status: 401 });
    }

    const eventType = payload.type;
    const eventData = payload.data;

    if (eventType === "subscription.created" || eventType === "order.created") {
      const clinicId = eventData.metadata?.clinicId;
      const creditsToAdd = eventData.metadata?.credits ? parseInt(eventData.metadata.credits) : 100;

      if (clinicId) {
        await prisma.clinic.update({
          where: { id: clinicId },
          data: {
            credits: {
              increment: creditsToAdd,
            },
          },
        });
        console.log(`[Polar Webhook] ${creditsToAdd} créditos adicionados para a clínica ${clinicId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Polar Webhook Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
