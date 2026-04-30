import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const userBadges = await prisma.userBadge.findMany({
    where: { badgeId: id },
    include: { user: { select: { id: true, handle: true, email: true } } },
    orderBy: { grantedAt: "desc" },
  });

  return NextResponse.json(userBadges);
}

// POST /api/admin/badges/[id]/users — atribuir badge a um usuário
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id: badgeId } = await params;
  const { userId } = await request.json();

  if (!userId) return NextResponse.json({ error: "userId obrigatório" }, { status: 400 });

  const userBadge = await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId } },
    create: { userId, badgeId },
    update: {},
  });

  return NextResponse.json(userBadge, { status: 201 });
}

// DELETE /api/admin/badges/[id]/users — revogar badge de um usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id: badgeId } = await params;
  const { userId } = await request.json();

  if (!userId) return NextResponse.json({ error: "userId obrigatório" }, { status: 400 });

  await prisma.userBadge.delete({
    where: { userId_badgeId: { userId, badgeId } },
  });

  return NextResponse.json({ ok: true });
}
