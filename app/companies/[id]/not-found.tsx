import Link from "next/link";
import { Navbar, Footer, Container } from "@/components/layout";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <Container>
          <div className="text-center">
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto text-[#94A3B8]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            
            <h1 className="font-sora text-4xl font-bold text-[#0F172A] mb-4">
              Empresa não encontrada
            </h1>
            
            <p className="text-[#64748B] text-lg mb-8 max-w-md mx-auto">
              A empresa que você está procurando não existe ou foi removida.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/"
                className="bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
              >
                Voltar para Home
              </Link>
              
              <Link
                href="/reviews/new"
                className="bg-white border border-[#E2E8F0] hover:border-[#2563EB] text-[#0F172A] px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
              >
                Adicionar Empresa
              </Link>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
