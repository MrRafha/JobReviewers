import { Container } from "@/components/layout";

const solutions = [
  {
    icon: "person_search",
    title: "Para Profissionais",
    description:
      "Acesso exclusivo a avaliações de empresas para tomar melhores decisões de carreira.",
  },
  {
    icon: "domain",
    title: "Para Empresas",
    description:
      "Insights sobre seu ambiente de trabalho e cultura para melhorias contínuas.",
  },
  {
    icon: "group",
    title: "Para RHs",
    description:
      "Ferramentas para demonstrar transparência e atrair talentos com melhor estrutura.",
  },
];

export default function SolutionSection() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-sm sm:p-12">
          <h2 className="font-sora text-3xl font-semibold text-[var(--text-primary)] mb-3">
            Nossa Solução em Ação
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mb-8">
            Uma plataforma transparente que beneficia todos na cadeia de talentos.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-6 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] duration-200"
              >
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 -right-1 font-sora font-bold text-[var(--text-primary)] select-none pointer-events-none"
                  style={{ fontSize: '4.5rem', lineHeight: 1, opacity: 0.04 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#DBEAFE] text-[var(--brand-primary)]">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    {solution.icon}
                  </span>
                </div>
                <h3 className="font-sora text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {solution.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
