import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="JobReviewers"
              width={52}
              height={38}
              className="h-10 w-13"
            />
            <span className="font-sora text-xl font-bold text-[var(--text-primary)]">
              JobReviewers
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Plataforma para avaliacoes anonimas e moderadas sobre empresas,
            ajudando profissionais a tomar melhores decisoes de carreira.
          </p>
        </div>

        <div>
          <h3 className="font-sora text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]">
            Navegacao
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/"
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/companies"
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Empresas
              </Link>
            </li>
            <li>
              <Link
                href="/reviews/new"
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Escrever avaliacao
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Criar conta
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-sora text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]">
            Legal
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/privacy"
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Privacidade
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Termos de uso
              </Link>
            </li>
            <li>
              <Link
                href="/guidelines"
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Diretrizes
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Contato
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-[var(--text-secondary)] sm:flex-row sm:px-6 lg:px-8">
          <p>© {currentYear} JobReviewers. Todos os direitos reservados.</p>
          <p>Transparencia com responsabilidade.</p>
        </div>
      </div>
    </footer>
  );
}
