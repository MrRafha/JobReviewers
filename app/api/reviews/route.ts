import { NextRequest, NextResponse } from "next/server";

import { ContractType, Seniority, WorkMode } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findOrCreateCompanyByName } from "@/lib/services/companies";
import { createReview } from "@/lib/services/reviews";

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
