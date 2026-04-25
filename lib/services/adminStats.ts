import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  const [resolved, dismissed, approved, pending, claimed, totalCompanies, companiesWithPending] =
    await prisma.$transaction([
      prisma.report.count({ where: { status: "RESOLVED" } }),
      prisma.report.count({ where: { status: "DISMISSED" } }),
      prisma.report.count({ where: { status: "APPROVED" } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: "CLAIMED" } }),
      prisma.company.count(),
      prisma.company.count({
        where: {
          reviews: {
            some: {
              reports: { some: { status: { in: ["PENDING", "CLAIMED"] } } },
            },
          },
        },
      }),
    ]);

  return {
    reports: { resolved, dismissed, approved, pending, claimed },
    companies: { total: totalCompanies, withPendingReports: companiesWithPending },
  };
}
