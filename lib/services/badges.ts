import { prisma } from "@/lib/prisma";

export async function applyAutoBadges(userId: string, createdAt: Date) {
  const autoBadges = await prisma.badge.findMany({
    where: { autoRule: { not: null } },
    select: { id: true, autoRule: true },
  });

  const now = new Date();
  const accountAgeDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  for (const badge of autoBadges) {
    if (badge.autoRule === "NEW_ACCOUNT" && accountAgeDays <= 7) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
        create: { userId, badgeId: badge.id },
        update: {},
      });
    }
  }
}
