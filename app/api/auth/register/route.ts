import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, handle } = body;

    if (!email || !password || !handle) {
      return NextResponse.json(
        { error: "Email, senha e handle são obrigatórios" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 409 },
      );
    }

    const existingHandle = await prisma.user.findUnique({
      where: { handle },
    });

    if (existingHandle) {
      return NextResponse.json(
        { error: "Este handle já está em uso" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        handle,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Conta criada com sucesso!", userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
