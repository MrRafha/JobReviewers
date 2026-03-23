import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Retorna o usuário logado ou null
 */
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      handle: true,
      name: true,
      image: true,
      role: true,
      verifiedEmail: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Exige autenticação — redireciona para /login se não logado
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Exige role ADMIN — redireciona para / se não é admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
