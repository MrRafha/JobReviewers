"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#2B2D31] border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <img
              src="/logo.png"
              alt="JobReviewers"
              className="h-10 w-14"
            />
            <span className="font-sora font-bold text-white text-lg hidden sm:block">
              Job Reviewers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Início
            </Link>
            <Link
              href="/companies"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Empresas
            </Link>
            <Link
              href="/about"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Sobre
            </Link>

            {/* CTA Button */}
            <Link
              href="/reviews/new"
              className="bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-white border border-[#22C55E]/30 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
            >
              Escrever Review
            </Link>

            {/* Profile Icon */}
            <Link
              href="/login"
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
              aria-label="Perfil"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#2B2D31]/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-white/80 hover:text-white transition-colors py-2 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              href="/companies"
              className="block text-white/80 hover:text-white transition-colors py-2 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Empresas
            </Link>
            <Link
              href="/about"
              className="block text-white/80 hover:text-white transition-colors py-2 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/reviews/new"
              className="block bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-white border border-[#22C55E]/30 px-4 py-2 rounded-full text-sm font-medium text-center transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Escrever Review
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors py-2 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Entrar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
