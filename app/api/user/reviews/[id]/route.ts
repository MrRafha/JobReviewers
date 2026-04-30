import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createReviewSchema } from "@/lib/validations/review";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id }, select: { userId: true } });

  if (!review) return NextResponse.json({ error: "Review não encontrada" }, { status: 404 });
  if (review.userId !== session.user.id) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const body = await request.json();
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }

  const { roleArea, seniority, contractType, workMode, year, ratingOverall, pros, cons } = parsed.data;

  const updated = await prisma.review.update({
    where: { id },
    data: { roleArea, seniority, contractType, workMode, year, ratingOverall, pros, cons },
    include: { company: { select: { id: true, name: true, slug: true } } },
  });

  // Notifica admins via report sintético para re-moderação
  await prisma.report.create({
    data: {
      reviewId: id,
      reporterUserId: session.user.id,
      reason: "[EDIT] Review editada pelo autor — revisão automática",
      status: "PENDING",
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id }, select: { userId: true } });

  if (!review) return NextResponse.json({ error: "Review não encontrada" }, { status: 404 });
  if (review.userId !== session.user.id) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  await prisma.review.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
