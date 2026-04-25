import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";
import { resolveReport, dismissReport, approveReport } from "@/lib/services/reports";
import { createAdminLog } from "@/lib/services/adminLog";

const actionSchema = z.object({
  action: z.enum(["resolve", "dismiss", "approve"]),
});

export async function PATCH(
  request: NextRequest,
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
    const body = await request.json();

    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Dados inválidos";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { action } = parsed.data;

    const report = await prisma.report.findUnique({
      where: { id },
      select: { id: true, reviewId: true, claimedByAdminId: true },
    });

    if (!report) {
      return NextResponse.json({ error: "Denúncia não encontrada" }, { status: 404 });
    }

    let updated;
    if (action === "resolve") {
      updated = await resolveReport(id);
    } else if (action === "dismiss") {
      updated = await dismissReport(id);
    } else {
      updated = await approveReport(id);
    }

    const logAction =
      action === "resolve" ? "resolve_report" :
      action === "dismiss" ? "dismiss_report" :
      "approve_report";

    await createAdminLog({
      adminId: session.user.id,
      action: logAction,
      targetType: "report",
      targetId: id,
      meta: JSON.stringify({ reviewId: report.reviewId }),
    });

    return NextResponse.json({ id: updated.id, status: updated.status, resolvedAt: updated.resolvedAt });
  } catch (error) {
    console.error("Error updating report:", error);
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ error: DB_UNAVAILABLE.MESSAGE }, { status: 503 });
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
