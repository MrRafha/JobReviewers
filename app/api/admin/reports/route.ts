import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { getPendingAndClaimedReports } from "@/lib/services/reports";
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
    const reports = await getPendingAndClaimedReports();

    const payload = reports.map((report) => ({
      id: report.id,
      reason: report.reason,
      status: report.status,
      claimedAt: report.claimedAt,
      claimedBy: report.claimedBy ? { handle: report.claimedBy.handle } : null,
      createdAt: report.createdAt,
      review: {
        id: report.review.id,
        pros: report.review.pros,
        cons: report.review.cons,
        ratingOverall: report.review.ratingOverall,
        roleArea: report.review.roleArea,
        hidden: report.review.hidden,
      },
      company: {
        name: report.review.company.name,
        slug: report.review.company.slug,
      },
      reporter: {
        handle: report.reporter.handle,
      },
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching reports:", error);
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ error: DB_UNAVAILABLE.MESSAGE }, { status: 503 });
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
