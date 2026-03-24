import { prisma } from "@/lib/prisma";

function normalizeCompanyName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

function slugifyCompanyName(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || "empresa";
}

async function generateUniqueCompanySlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.company.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}

export async function findCompanyByName(name: string) {
  const normalizedName = normalizeCompanyName(name);

  if (!normalizedName) {
    return null;
  }

  return prisma.company.findFirst({
    where: {
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
    },
  });
}

export async function createCompanyByName(name: string) {
  const normalizedName = normalizeCompanyName(name);

  if (!normalizedName) {
    throw new Error("Nome da empresa inválido");
  }

  const baseSlug = slugifyCompanyName(normalizedName);
  const slug = await generateUniqueCompanySlug(baseSlug);

  return prisma.company.create({
    data: {
      name: normalizedName,
      slug,
    },
  });
}

export async function findOrCreateCompanyByName(name: string) {
  const normalizedName = normalizeCompanyName(name);

  if (!normalizedName) {
    throw new Error("Nome da empresa inválido");
  }

  const existing = await findCompanyByName(normalizedName);
  if (existing) {
    return existing;
  }

  try {
    return await createCompanyByName(normalizedName);
  } catch {
    // Handle race conditions where another request creates the same company name.
    const createdByOtherRequest = await findCompanyByName(normalizedName);
    if (createdByOtherRequest) {
      return createdByOtherRequest;
    }
    throw new Error("Não foi possível criar a empresa");
  }
}

export async function getCompanyById(id: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { hidden: false },
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                handle: true,
              },
            },
          },
        },
      },
    });

    return company;
  } catch (error) {
    console.error("Error fetching company:", error);
    return null;
  }
}

export async function getCompanyBySlug(slug: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        reviews: {
          where: { hidden: false },
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                handle: true,
              },
            },
          },
        },
      },
    });

    return company;
  } catch (error) {
    console.error("Error fetching company:", error);
    return null;
  }
}

export async function getAllCompanies(limit?: number) {
  try {
    const companies = await prisma.company.findMany({
      take: limit,
      include: {
        reviews: {
          where: { hidden: false },
        },
      },
    });

    // Calcular rating médio para cada empresa
    const companiesWithRating = companies.map((company) => {
      const totalRating = company.reviews.reduce(
        (sum, review) => sum + review.ratingOverall,
        0
      );
      const averageRating =
        company.reviews.length > 0 ? totalRating / company.reviews.length : 0;

      return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        location:
          company.city && company.state
            ? `${company.city}, ${company.state}`
            : "Localização não informada",
        rating: Number(averageRating.toFixed(1)),
        reviewCount: company.reviews.length,
      };
    });

    // Ordenar por avaliação (melhor primeiro), e em caso de empate, por número de reviews
    return companiesWithRating.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.reviewCount - a.reviewCount;
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function searchCompanies(query: string) {
  try {
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { state: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        reviews: {
          where: { hidden: false },
        },
      },
      take: 20,
    });

    const companiesWithRating = companies.map((company) => {
      const totalRating = company.reviews.reduce(
        (sum, review) => sum + review.ratingOverall,
        0
      );
      const averageRating =
        company.reviews.length > 0 ? totalRating / company.reviews.length : 0;

      return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        location:
          company.city && company.state
            ? `${company.city}, ${company.state}`
            : "Localização não informada",
        rating: Number(averageRating.toFixed(1)),
        reviewCount: company.reviews.length,
      };
    });

    return companiesWithRating;
  } catch (error) {
    console.error("Error searching companies:", error);
    return [];
  }
}

export async function getCompanyStats(companyId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        companyId,
        hidden: false,
      },
      select: {
        ratingOverall: true,
      },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 },
        ],
      };
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.ratingOverall,
      0
    );
    const averageRating = totalRating / reviews.length;

    // Calcular distribuição
    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((r) => r.ratingOverall === stars).length;
      const percentage = Math.round((count / reviews.length) * 100);
      return { stars, count, percentage };
    });

    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      distribution,
    };
  } catch (error) {
    console.error("Error fetching company stats:", error);
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: [
        { stars: 5, count: 0, percentage: 0 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ],
    };
  }
}
