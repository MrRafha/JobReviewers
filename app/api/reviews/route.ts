import { NextRequest, NextResponse } from "next/server";
import { createReview } from "@/lib/services/reviews";
import { prisma } from "@/lib/prisma";
import { Seniority, ContractType, WorkMode } from "@prisma/client";

export async function POST(request: NextRequest) {
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
    if (!companyId || !roleArea || !seniority || !contractType || !workMode || !ratingOverall || !pros || !cons) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    if (ratingOverall < 1 || ratingOverall > 5) {
      return NextResponse.json(
        { error: "A avaliação deve ser entre 1 e 5" },
        { status: 400 }
      );
    }

    // TODO: Pegar userId da sessão autenticada
    // Por enquanto, criar ou buscar usuário anônimo temporário
    let user = await prisma.user.findFirst({
      where: { email: "anonimo@temp.com" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "anonimo@temp.com",
          handle: "Usuario_Anonimo",
          verifiedEmail: true,
        },
      });
    }

    const review = await createReview({
      companyId,
      userId: user.id,
      roleArea,
      seniority: seniority as Seniority,
      contractType: contractType as ContractType,
      workMode: workMode as WorkMode,
      year: year ? parseInt(year) : undefined,
      ratingOverall: parseInt(ratingOverall),
      pros,
      cons,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Erro ao criar review" },
      { status: 500 }
    );
  }
}
