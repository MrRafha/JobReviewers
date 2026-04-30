import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadBadgeIcon } from "@/lib/cloudinary";

const updateBadgeSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().min(2).max(200).optional(),
  iconBase64: z.string().min(10).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  autoRule: z.enum(["NEW_ACCOUNT"]).nullable().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.badge.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = updateBadgeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }

  const { iconBase64, ...rest } = parsed.data;
  let iconUrl: string | undefined;
  if (iconBase64) {
    const { url } = await uploadBadgeIcon(iconBase64);
    iconUrl = url;
  }

  const badge = await prisma.badge.update({
    where: { id },
    data: { ...rest, ...(iconUrl ? { iconUrl } : {}) },
    include: { _count: { select: { userBadges: true } } },
  });

  return NextResponse.json(badge);
}
