import { NextRequest, NextResponse } from "next/server";

import { getCompanyBySlug, getCompanyStats } from "@/lib/services/companies";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { getReviewsByCompany } from "@/lib/services/reviews";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const company = await getCompanyBySlug(slug);
    if (!company) {
      return NextResponse.json(
        { error: "Empresa não encontrada" },
        { status: 404 }
      );
    }
    const [stats, { reviews }] = await Promise.all([
      getCompanyStats(company.id),
      getReviewsByCompany(company.id, { limit: 10 }),
    ]);
    return NextResponse.json({
      id: company.id,
      name: company.name,
      slug: company.slug,
      city: company.city,
      state: company.state,
      stats,
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.ratingOverall,
        roleArea: r.roleArea,
        seniority: r.seniority,
        contractType: r.contractType,
        workMode: r.workMode,
        year: r.year,
        pros: r.pros,
        cons: r.cons,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ error: DB_UNAVAILABLE.MESSAGE }, { status: 503 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
