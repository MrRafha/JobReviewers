import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Container, Footer, Navbar } from "@/components/layout";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";

export const metadata = { title: "Meu Perfil" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/perfil");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      handle: true,
      createdAt: true,
      _count: { select: { reviews: true } },
      userBadges: {
        orderBy: { grantedAt: "asc" },
        include: {
          badge: { select: { id: true, name: true, description: true, iconUrl: true, color: true } },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <Container size="md">
          <div className="text-center mb-8">
            <h1 className="font-sora text-4xl font-bold text-[var(--text-primary)] mb-3">
              Meu Perfil
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Gerencie suas informações
            </p>
          </div>
          <ProfileClient
            profile={{
              id: user.id,
              email: user.email,
              handle: user.handle,
              createdAt: user.createdAt.toISOString(),
              _count: user._count,
              badges: user.userBadges.map((ub) => ub.badge),
            }}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
