import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getAdminStats } from "@/lib/services/adminStats";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ error: DB_UNAVAILABLE.MESSAGE }, { status: 503 });
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
