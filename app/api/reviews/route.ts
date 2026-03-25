import { NextRequest, NextResponse } from "next/server";

import { ContractType, Seniority, WorkMode } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { findOrCreateCompanyByName } from "@/lib/services/companies";
import { createReview, getRecentPublicReviews } from "@/lib/services/reviews";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const parsedLimit = limitParam ? parseInt(limitParam, 10) : 3;
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 12)
      : 3;

    const reviews = await getRecentPublicReviews(limit);

    const payload = reviews.map((review) => ({
      id: review.id,
      rating: review.ratingOverall,
      position: review.roleArea,
      positives: review.pros,
      negatives: review.cons,
      date: review.createdAt,
      companyName: review.company.name,
      authorHandle: review.user.handle,
      workMode: review.workMode,
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json(
        { error: DB_UNAVAILABLE.MESSAGE },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Falha ao buscar reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();

    const {
      companyId,
      companyName,
      roleArea,
      seniority,
      contractType,
      workMode,
      year,
      ratingOverall,
      pros,
      cons,
    } = body;

    // Validações básicas
    if (
      !roleArea ||
      !seniority ||
      !contractType ||
      !workMode ||
      !ratingOverall ||
      !pros ||
      !cons
    ) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    if (!companyId && !String(companyName || "").trim()) {
      return NextResponse.json(
        { error: "Informe uma empresa para publicar a review" },
        { status: 400 }
      );
    }

    const numericRating = Number(ratingOverall);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "A avaliação deve ser entre 1 e 5" },
        { status: 400 }
      );
    }

    let resolvedCompanyId: string;

    if (companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        return NextResponse.json(
          { error: "Empresa não encontrada" },
          { status: 404 }
        );
      }

      resolvedCompanyId = company.id;
    } else {
      const company = await findOrCreateCompanyByName(String(companyName));
      resolvedCompanyId = company.id;
    }

    const review = await createReview({
      companyId: resolvedCompanyId,
      userId: session.user.id,
      roleArea,
      seniority: String(seniority).toUpperCase() as Seniority,
      contractType: String(contractType).toUpperCase() as ContractType,
      workMode: String(workMode).toUpperCase() as WorkMode,
      year: year ? parseInt(String(year), 10) : undefined,
      ratingOverall: numericRating,
      pros,
      cons,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
