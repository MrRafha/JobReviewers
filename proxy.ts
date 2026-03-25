import { NextResponse } from "next/server";

import { auth } from "@/auth";

const publicRoutes = [
  "/",
  "/companies",
  "/login",
  "/register",
  "/forgot-password",
];

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.includes(pathname)) return true;
  if (pathname.startsWith("/companies/")) return true;
  if (pathname.startsWith("/reset-password/")) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  if (pathname.startsWith("/api/companies")) return true;
  if (pathname.startsWith("/api/reviews")) return true;
  return false;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminRoute = pathname.startsWith("/admin");

  // Redireciona usuários logados para fora das páginas de auth
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Permite acesso a rotas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redireciona para login se não está autenticado
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // Verifica se é admin para rotas admin
  if (isAdminRoute && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Skip Next internals and any static file request (e.g. /logo.png, /icons/*.svg).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
