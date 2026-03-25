"use client";

import { useState } from "react";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-[1.01]"
        >
          <Image
            src="/logo.png"
            alt="JobReviewers"
            width={42}
            height={30}
            className="h-8 w-11"
          />
          <span className="font-sora text-xl font-bold text-[var(--text-primary)]">
            JobReviewers
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Inicio
          </Link>
          <Link
            href="/#empresas"
            className="text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Avaliacoes
          </Link>
          <Link
            href="/#como-funciona"
            className="text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Como Funciona
          </Link>
          <Link
            href="/#seguranca"
            className="text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Seguranca
          </Link>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {session?.user ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-subtle)]"
            >
              Sair
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-subtle)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-hover)]"
              >
                Cadastre-se
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] transition hover:bg-[var(--bg-subtle)] lg:hidden"
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-[var(--border)] bg-white lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {[
              { href: "/", label: "Inicio" },
              { href: "/#empresas", label: "Avaliacoes" },
              { href: "/#como-funciona", label: "Como Funciona" },
              { href: "/#seguranca", label: "Seguranca" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
              >
                {item.label}
              </Link>
            ))}

            {session?.user ? (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="mt-2 inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)]"
              >
                Sair
              </button>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-semibold text-white"
                >
                  Cadastro
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
