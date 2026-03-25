import { Container } from "@/components/layout";

const steps = [
  {
    number: "1",
    icon: "person_add",
    title: "Crie sua Conta",
    description:
      "Cadastre-se de forma anônima com email verificado para garantir a autenticidade.",
  },
  {
    number: "2",
    icon: "travel_explore",
    title: "Explore Avaliações",
    description:
      "Busque por empresas e leia avaliações honestas de profissionais que já trabalharam lá.",
  },
  {
    number: "3",
    icon: "rate_review",
    title: "Compartilhe Sua Experiência",
    description:
      "Deixe sua avaliação e ajude outros profissionais a tomar melhores decisões.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-16 sm:py-20">
      <Container>
        <h2 className="text-center font-sora text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
          Como Funciona
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-5 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DBEAFE] text-[var(--brand-primary)]">
                <span className="material-symbols-rounded" aria-hidden="true">
                  {step.icon}
                </span>
              </div>

              <div className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                Etapa {step.number}
              </div>

              <h3 className="mt-4 font-sora text-lg font-semibold text-[var(--text-primary)] min-h-[56px]">
                {step.title}
              </h3>

              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 lg:min-h-0 lg:group-hover:min-h-[72px]">
                {step.description}
              </p>
              <p className="mt-2 text-xs text-[var(--text-muted)] lg:hidden">
                Toque para ver mais detalhes
              </p>

              {index < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                  <span
                    className="material-symbols-rounded text-[var(--brand-primary)]"
                    aria-hidden="true"
                  >
                    trending_flat
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
