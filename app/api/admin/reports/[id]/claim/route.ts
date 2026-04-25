import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { claimReport, unclaimReport } from "@/lib/services/reports";
import { createAdminLog } from "@/lib/services/adminLog";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const report = await claimReport(id, session.user.id);

    await createAdminLog({
      adminId: session.user.id,
      action: "claim_report",
      targetType: "report",
      targetId: id,
    });

    return NextResponse.json(report);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ error: DB_UNAVAILABLE.MESSAGE }, { status: 503 });
    }
    const err = error as Error & { code?: string; claimedBy?: { handle: string } };
    if (err.code === "NOT_FOUND") {
      return NextResponse.json({ error: "Denúncia não encontrada" }, { status: 404 });
    }
    if (err.code === "ALREADY_CLAIMED") {
      return NextResponse.json(
        { error: err.message, claimedBy: err.claimedBy },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const report = await unclaimReport(id);

    await createAdminLog({
      adminId: session.user.id,
      action: "unclaim_report",
      targetType: "report",
      targetId: id,
    });

    return NextResponse.json(report);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ error: DB_UNAVAILABLE.MESSAGE }, { status: 503 });
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
