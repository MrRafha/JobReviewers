import Link from "next/link";
import { Container } from "@/components/layout";

export default function CTASection() {
  return (
    <section className="px-4 pb-16 sm:pb-20">
      <Container>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[var(--brand-primary)]">
            <span className="material-symbols-rounded" aria-hidden="true">
              rocket_launch
            </span>
          </div>

          <h2 className="font-sora text-3xl font-semibold mb-4 text-[var(--text-primary)] sm:text-4xl">
            Comece Agora
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Junte-se a profissionais que buscam transparência no mercado de trabalho.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center sm:gap-4">
            <Link
              href="/companies"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] text-white px-8 font-semibold transition hover:bg-[var(--brand-primary-hover)]"
            >
              <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
                business
              </span>
              Explorar Empresas
            </Link>
            <Link
              href="/reviews/new"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-primary)] px-8 font-semibold transition hover:bg-[var(--bg-subtle)]"
            >
              <span className="material-symbols-rounded text-[20px] text-[var(--brand-primary)]" aria-hidden="true">
                edit_square
              </span>
              Escrever Avaliação
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
