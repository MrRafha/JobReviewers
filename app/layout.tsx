import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JobReviewers | Avaliações Anônimas de Empresas",
  description:
    "Descubra como é trabalhar nas empresas através de avaliações anônimas e moderadas de profissionais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,0,0"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
