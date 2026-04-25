import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { createReport } from "@/lib/services/reports";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";
import { createReportSchema } from "@/lib/validations/report";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const parsed = createReportSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Dados inválidos";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { reviewId, reason } = parsed.data;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review não encontrada" }, { status: 404 });
    }

    if (review.userId === session.user.id) {
      return NextResponse.json(
        { error: "Você não pode denunciar sua própria review" },
        { status: 400 }
      );
    }

    const report = await createReport({
      reviewId,
      reporterUserId: session.user.id,
      reason,
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
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
