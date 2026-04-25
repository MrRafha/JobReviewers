import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { auth } from "@/auth";
import { getAdminNotes, createAdminNote } from "@/lib/services/adminNotes";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";

const noteSchema = z.object({
  content: z.string().min(1).max(500),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const notes = await getAdminNotes();
    return NextResponse.json(notes);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ error: DB_UNAVAILABLE.MESSAGE }, { status: 503 });
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Dados inválidos";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const note = await createAdminNote(parsed.data.content, session.user.id);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ error: DB_UNAVAILABLE.MESSAGE }, { status: 503 });
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
