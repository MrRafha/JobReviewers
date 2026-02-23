import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import {
  NumberDictionary,
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

import { prisma } from "@/lib/prisma";

const numberDictionary = NumberDictionary.generate({ min: 10, max: 999 });

async function generateUniqueHandle(): Promise<string> {
  const maxAttempts = 10;

  for (let i = 0; i < maxAttempts; i++) {
    const handle = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, numberDictionary],
      separator: "_",
      style: "lowerCase",
      length: 3,
    });

    const existing = await prisma.user.findUnique({ where: { handle } });
    if (!existing) return handle;
  }

  // Fallback: adiciona timestamp para garantir unicidade
  return (
    uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: "_",
      style: "lowerCase",
      length: 2,
    }) + `_${Date.now()}`
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 409 }
      );
    }

    const handle = await generateUniqueHandle();
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
