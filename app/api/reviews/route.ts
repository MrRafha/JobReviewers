import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { createReview } from "@/lib/services/reviews";
import { prisma } from "@/lib/prisma";
import { Seniority, ContractType, WorkMode } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();

    const {
      companyId,
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
      !companyId ||
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

    const numericRating = Number(ratingOverall);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "A avaliação deve ser entre 1 e 5" },
        { status: 400 }
      );
    }

    // Verificar se a empresa existe
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Empresa não encontrada" },
        { status: 404 }
      );
    }

    const review = await createReview({
      companyId,
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
