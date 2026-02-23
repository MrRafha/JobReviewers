import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const limit = parseInt(searchParams.get("limit") || "0", 10);

  const companies = await prisma.company.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    orderBy: { createdAt: "desc" },
    ...(limit > 0 ? { take: limit } : {}),
    include: {
      _count: { select: { reviews: true } },
      reviews: {
        where: { hidden: false },
        select: { ratingOverall: true },
      },
    },
  });

  const result = companies.map((company) => {
    const ratings = company.reviews.map((r) => r.ratingOverall);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      city: company.city,
      state: company.state,
      createdAt: company.createdAt,
      reviewCount: company._count.reviews,
      averageRating: Math.round(avgRating * 10) / 10,
    };
  });

  return NextResponse.json(result);
}
