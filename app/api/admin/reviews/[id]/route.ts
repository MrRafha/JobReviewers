import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";
import { createAdminLog } from "@/lib/services/adminLog";

const hideSchema = z.object({
  hidden: z.boolean(),
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

    const parsed = hideSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Dados inválidos";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { hidden } = parsed.data;

    const existing = await prisma.review.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Review não encontrada" }, { status: 404 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { hidden },
      select: { id: true, hidden: true },
    });

    await createAdminLog({
      adminId: session.user.id,
      action: hidden ? "hide_review" : "unhide_review",
      targetType: "review",
      targetId: id,
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review visibility:", error);
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json(
        { error: DB_UNAVAILABLE.MESSAGE },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
