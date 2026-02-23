"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Não exibir nas páginas de auth
  if (pathname === "/login" || pathname === "/register") return null;

  // Aguardar carregamento da sessão
  if (status === "loading") return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      {session?.user ? (
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="cursor-pointer rounded-full border border-white/20 bg-[#2B2D31]/85 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md transition-all hover:bg-[#2B2D31]/95 hover:shadow-lg"
        >
          Sair
        </button>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-[#2B2D31]/85 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md transition-all hover:bg-[#2B2D31]/95 hover:shadow-lg"
        >
          Entrar
        </Link>
      )}
    </div>
  );
}
