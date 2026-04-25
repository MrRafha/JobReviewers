import { Container } from "@/components/layout";

const benefits = [
  {
    icon: "verified_user",
    title: "Avaliações Autênticas",
    description:
      "Profissionais anônimos compartilham suas experiências reais sobre empresa, cultura e ambiente.",
  },
  {
    icon: "query_stats",
    title: "Decisões Informadas",
    description:
      "Acesso a dados consolidados para entender melhor as condições de trabalho antes de aceitar uma oportunidade.",
  },
  {
    icon: "shield_lock",
    title: "Comunidade Segura",
    description:
      "Anonimato garantido com políticas de privacidade rigorosas e verificação de profissionais.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-subtle)] py-16 sm:py-20">
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "var(--brand-primary)",
          filter: "blur(80px)",
          opacity: 0.07,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "var(--brand-accent)",
          filter: "blur(80px)",
          opacity: 0.07,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <Container>
        <h2 className="text-center font-sora text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
          Por Que Escolher JobReviewers?
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE] text-[var(--brand-primary)] transition group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                <span className="material-symbols-rounded" aria-hidden="true">
                  {benefit.icon}
                </span>
              </div>
              <h3 className="font-sora text-lg font-semibold text-[var(--text-primary)] mb-2">
                {benefit.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
