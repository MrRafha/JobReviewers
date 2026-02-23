import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

    if (ratingOverall < 1 || ratingOverall > 5) {
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

    const review = await prisma.review.create({
      data: {
        companyId,
        userId: session.user.id,
        roleArea,
        seniority: seniority.toUpperCase(),
        contractType: contractType.toUpperCase(),
        workMode: workMode.toUpperCase(),
        year: year ? parseInt(year, 10) : null,
        ratingOverall: parseInt(ratingOverall, 10),
        pros,
        cons,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar review:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
