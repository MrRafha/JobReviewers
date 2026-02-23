"use client";

import { useState } from "react";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Não exibir nas páginas de auth
  if (pathname === "/login" || pathname === "/register") return null;

  // Aguardar carregamento da sessão
  if (status === "loading") return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      {session?.user ? (
        <div className="relative">
          {/* Botão do usuário - glassmorphism pill */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex cursor-pointer items-center gap-2.5 rounded-full border border-white/20 bg-[#2B2D31]/85 px-4 py-2.5 backdrop-blur-md transition-all hover:bg-[#2B2D31]/95 hover:shadow-lg"
          >
            {/* Avatar com inicial */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]/20 text-xs font-semibold text-white">
              {(
                session.user.name?.[0] ??
                session.user.email?.[0] ??
                "U"
              ).toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium text-white/90 sm:inline">
              {session.user.name ?? session.user.email}
            </span>
            {/* Chevron */}
            <svg
              className={`h-3.5 w-3.5 text-white/60 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <>
              {/* Overlay invisível para fechar o menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />

              <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-white/15 bg-[#2B2D31]/90 shadow-xl backdrop-blur-lg">
                {/* Info do usuário */}
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="truncate text-sm font-medium text-white/90">
                    {session.user.name ?? "Usuário"}
                  </p>
                  <p className="truncate text-xs text-white/50">
                    {session.user.email}
                  </p>
                </div>

                {/* Links */}
                <div className="py-1">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
                      />
                    </svg>
                    Início
                  </Link>
                  <Link
                    href="/reviews/new"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Nova Review
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-white/10 py-1">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm text-[#EF4444]/90 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                      />
                    </svg>
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-[#2B2D31]/85 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md transition-all hover:bg-[#2B2D31]/95 hover:shadow-lg"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
            />
          </svg>
          Entrar
        </Link>
      )}
    </div>
  );
}
