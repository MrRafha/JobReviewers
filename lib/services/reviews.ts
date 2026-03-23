import { prisma } from "@/lib/prisma";
import { Seniority, ContractType, WorkMode } from "@prisma/client";

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
  options?: {
    page?: number;
    limit?: number;
    sortBy?: "recent" | "helpful" | "rating-high" | "rating-low";
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  let orderBy: { createdAt?: "desc" | "asc"; ratingOverall?: "desc" | "asc" } = { createdAt: "desc" };

  if (options?.sortBy === "rating-high") {
    orderBy = { ratingOverall: "desc" };
  } else if (options?.sortBy === "rating-low") {
    orderBy = { ratingOverall: "asc" };
  }

  try {
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: {
          companyId,
          hidden: false,
        },
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
      prisma.review.count({
        where: {
          companyId,
          hidden: false,
        },
      }),
    ]);

    return {
      reviews,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      reviews: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}
