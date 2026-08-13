import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SetupClinicForm } from "./setup-form";

export const dynamic = "force-dynamic";

export default async function SetupClinicPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Se o usuário já possui uma clínica associada, redireciona para o dashboard
  if (session.user.clinicId) {
    redirect("/dashboard");
  }

  return <SetupClinicForm userName={session.user.name || "Dentista"} />;
}
