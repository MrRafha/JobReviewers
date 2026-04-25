import { ContractType, Prisma, Seniority, WorkMode } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";

export interface CreateReviewData {
  companyId: string;
  userId: string;
  roleArea: string;
  seniority: Seniority;
  contractType: ContractType;
  workMode: WorkMode;
  year?: number;
  ratingOverall: number;
  pros: string;
  cons: string;
}

export interface GetReviewsByCompanyOptions {
  page?: number;
  limit?: number;
  sortBy?: "recent" | "helpful" | "rating-high" | "rating-low";
  seniority?: Seniority;
  contractType?: ContractType;
  workMode?: WorkMode;
  year?: number;
}

export async function createReview(data: CreateReviewData) {
  try {
    const review = await prisma.review.create({
      data,
      include: {
        company: true,
        user: {
          select: {
            handle: true,
          },
        },
      },
    });

    return review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Falha ao criar review");
  }
}

export async function getReviewsByCompany(
  companyId: string,
  options?: GetReviewsByCompanyOptions
) {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  let orderBy: { createdAt?: "desc" | "asc"; ratingOverall?: "desc" | "asc" } =
    { createdAt: "desc" };

  if (options?.sortBy === "rating-high") {
    orderBy = { ratingOverall: "desc" };
  } else if (options?.sortBy === "rating-low") {
    orderBy = { ratingOverall: "asc" };
  }

  const where: Prisma.ReviewWhereInput = {
    companyId,
    hidden: false,
  };

  if (options?.seniority) {
    where.seniority = options.seniority;
  }
  if (options?.contractType) {
    where.contractType = options.contractType;
  }
  if (options?.workMode) {
    where.workMode = options.workMode;
  }
  if (options?.year !== undefined) {
    where.year = options.year;
  }

  try {
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              handle: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    if (isDatabaseUnavailableError(error)) {
      throw error;
    }
    return {
      reviews: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

export async function getRecentPublicReviews(limit = 3) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        hidden: false,
      },
      orderBy: [{ ratingOverall: "desc" }, { createdAt: "desc" }],
      take: limit,
      include: {
        company: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            handle: true,
          },
        },
      },
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching recent public reviews:", error);
    throw error;
  }
}
