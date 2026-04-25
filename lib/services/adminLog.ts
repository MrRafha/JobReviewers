import { prisma } from "@/lib/prisma";

export async function createAdminLog(data: {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  meta?: string;
}) {
  return prisma.adminLog.create({ data });
}
