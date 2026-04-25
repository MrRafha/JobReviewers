import { prisma } from "@/lib/prisma";

export async function getAdminNotes() {
  return prisma.adminNote.findMany({
    include: { author: { select: { handle: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function createAdminNote(content: string, authorId: string) {
  return prisma.adminNote.create({
    data: { content, authorId },
    include: { author: { select: { handle: true } } },
  });
}

export async function deleteAdminNote(id: string) {
  return prisma.adminNote.delete({ where: { id } });
}
