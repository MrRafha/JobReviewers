import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const { searchParams } = request.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const targetType = searchParams.get("targetType") ?? undefined;

    const where = targetType ? { targetType } : {};

    const [logs, totalCount] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        include: {
          admin: {
            select: { handle: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.adminLog.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({ logs, totalCount, totalPages, currentPage: page });
  } catch (error) {
    console.error("Error fetching admin logs:", error);
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
