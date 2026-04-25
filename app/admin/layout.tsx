"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/denuncias", label: "Denúncias", icon: "flag" },
    { href: "/admin/logs", label: "Logs", icon: "history" },
    { href: "/admin/usuarios", label: "Usuários", icon: "group" },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <aside
        className="w-56 shrink-0 flex flex-col border-r"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="px-5 py-5 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="text-sm font-semibold tracking-wide uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Admin
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "rgba(37,99,235,0.08)"
                    : "transparent",
                  color: isActive
                    ? "var(--brand-primary)"
                    : "var(--text-secondary)",
                }}
              >
                <span
                  className="material-symbols-rounded"
                  translate="no"
                  aria-hidden="true"
                  style={{ fontSize: "1.125rem" }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="h-14 flex items-center justify-between px-6 border-b shrink-0"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
        >
          <span
            className="text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Painel Admin
          </span>
          {session?.user?.name && (
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              @{session.user.name}
            </span>
          )}
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
