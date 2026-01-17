import { prisma } from "@/lib/prisma";
import type { Company, Review, User } from "@prisma/client";


export type ReviewWithUser = Review & {
  user: User;
};


export interface CompanyWithReviews extends Company {
  reviews: ReviewWithUser[];
}

export async function getCompanyBySlug(
  slug?: string
): Promise<CompanyWithReviews | null> {
  if (!slug) return null;

  return prisma.company.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: { hidden: false },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getCompanyById(
  id?: string
): Promise<CompanyWithReviews | null> {
  if (!id) return null;

  return prisma.company.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { hidden: false },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce(
    (acc, review) => acc + review.ratingOverall,
    0
  );

  return Math.round((sum / reviews.length) * 10) / 10;
}

export async function getCompanyWithStats(
  slug: string
): Promise<
  | (CompanyWithReviews & {
      averageRating: number;
      totalReviews: number;
    })
  | null
> {
  const company = await getCompanyBySlug(slug);

  if (!company) return null;

  return {
    ...company,
    averageRating: calculateAverageRating(company.reviews),
    totalReviews: company.reviews.length,
  };
}
