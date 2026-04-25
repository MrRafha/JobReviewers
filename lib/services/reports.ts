import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";

const REPORT_INCLUDE = {
  review: {
    select: {
      id: true,
      pros: true,
      cons: true,
      ratingOverall: true,
      roleArea: true,
      hidden: true,
      company: { select: { name: true, slug: true } },
    },
  },
  reporter: { select: { handle: true } },
  claimedBy: { select: { handle: true } },
} as const;

export async function createReport(data: {
  reviewId: string;
  reporterUserId: string;
  reason: string;
}) {
  try {
    return await prisma.report.create({ data });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) throw error;
    throw new Error("Falha ao criar denúncia");
  }
}

export async function getPendingAndClaimedReports() {
  try {
    return await prisma.report.findMany({
      where: { status: { in: ["PENDING", "CLAIMED"] } },
      include: REPORT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) throw error;
    throw new Error("Falha ao buscar denúncias");
  }
}

export async function claimReport(reportId: string, adminId: string) {
  const updated = await prisma.report.updateMany({
    where: { id: reportId, status: "PENDING" },
    data: { status: "CLAIMED", claimedByAdminId: adminId, claimedAt: new Date() },
  });

  if (updated.count === 0) {
    const current = await prisma.report.findUnique({
      where: { id: reportId },
      select: { status: true, claimedBy: { select: { handle: true } } },
    });
    if (!current) throw Object.assign(new Error("Denúncia não encontrada"), { code: "NOT_FOUND" });
    throw Object.assign(
      new Error(`Já está em análise por @${current.claimedBy?.handle ?? "outro admin"}`),
      { code: "ALREADY_CLAIMED", claimedBy: current.claimedBy }
    );
  }

  return prisma.report.findUniqueOrThrow({
    where: { id: reportId },
    include: REPORT_INCLUDE,
  });
}

export async function unclaimReport(reportId: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: { status: "PENDING", claimedByAdminId: null, claimedAt: null },
    include: REPORT_INCLUDE,
  });
}

export async function resolveReport(reportId: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: { status: "RESOLVED", resolvedAt: new Date() },
  });
}

export async function dismissReport(reportId: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: { status: "DISMISSED", resolvedAt: new Date() },
  });
}

export async function approveReport(reportId: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: { status: "APPROVED", resolvedAt: new Date() },
  });
}
