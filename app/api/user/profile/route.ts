import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const updateHandleSchema = z.object({
  handle: z
    .string()
    .min(3, "O apelido deve ter pelo menos 3 caracteres")
    .max(30, "O apelido deve ter no máximo 30 caracteres")
    .regex(
      /^[a-z0-9_]+$/,
      "O apelido só pode conter letras minúsculas, números e _"
    ),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      handle: true,
      createdAt: true,
      _count: { select: { reviews: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateHandleSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dados inválidos";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { handle } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { handle } });
  if (existing && existing.id !== session.user.id) {
    return NextResponse.json(
      { error: "Esse apelido já está em uso" },
      { status: 409 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { handle },
    select: { id: true, email: true, handle: true },
  });

  return NextResponse.json(updated);
}
