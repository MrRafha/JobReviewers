import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadBadgeIcon } from "@/lib/cloudinary";

const createBadgeSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
  iconBase64: z.string().min(10),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  autoRule: z.enum(["NEW_ACCOUNT"]).nullable().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const badges = await prisma.badge.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { userBadges: true } } },
  });

  return NextResponse.json(badges);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = createBadgeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }

  const { name, description, iconBase64, color, autoRule } = parsed.data;

  const { url } = await uploadBadgeIcon(iconBase64);

  const badge = await prisma.badge.create({
    data: { name, description, iconUrl: url, color, autoRule: autoRule ?? null },
    include: { _count: { select: { userBadges: true } } },
  });

  return NextResponse.json(badge, { status: 201 });
}
