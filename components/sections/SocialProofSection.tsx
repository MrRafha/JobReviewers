import { Container } from "@/components/layout";

interface FeaturedReview {
  id: string;
  rating: number;
  position: string;
  positives: string;
  negatives: string;
  date: string;
  companyName: string;
  authorHandle: string;
  workMode: string;
}

interface SocialProofSectionProps {
  featuredReview: FeaturedReview | null;
}

function resolveWorkModeLabel(workMode: string) {
  if (workMode === "REMOTO") return "Remoto";
  if (workMode === "PRESENCIAL") return "Presencial";
  return "Híbrido";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const securityFeatures = [
  {
    icon: "🔒",
    title: "Anonimato Total",
    description: "Suas avaliações são 100% anônimas",
  },
  {
    icon: "⚡",
    title: "Verificado",
    description: "Apenas profissionais autênticos",
  },
  {
    icon: "🛡️",
    title: "Seguro",
    description: "LGPD compliant e criptografado",
  },
];

export default function SocialProofSection({
  featuredReview,
}: SocialProofSectionProps) {
  return (
    <section id="seguranca" className="py-8 sm:py-12">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Featured Review */}
          <div>
            <h3 className="font-sora text-2xl font-semibold text-[var(--text-primary)] mb-6">
              O que Profissionais Dizem
            </h3>

            {featuredReview ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm">
                {/* Rating */}
                <div className="mb-4 flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < Math.round(featuredReview.rating)
                          ? "text-[#fbbf24]"
                          : "text-[#e5e7eb]"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Company and Position */}
                <p className="font-sora text-lg font-semibold text-[var(--text-primary)] mb-1">
                  {featuredReview.companyName}
                </p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {featuredReview.position} • {resolveWorkModeLabel(featuredReview.workMode)}
                </p>

                {/* Pros and Cons */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-[var(--success)] mb-1">
                      Pontos Positivos
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {featuredReview.positives}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--error)] mb-1">
                      Pontos Negativos
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {featuredReview.negatives}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-[var(--brand-primary)] bg-opacity-10" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {featuredReview.authorHandle}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {formatDate(featuredReview.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 text-center">
                <p className="text-[var(--text-secondary)]">
                  Nenhuma avaliação disponível no momento
                </p>
              </div>
            )}
          </div>

          {/* Security Features */}
          <div>
            <h3 className="font-sora text-2xl font-semibold text-[var(--text-primary)] mb-6">
              Segurança Garantida
            </h3>
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex gap-4"
                >
                  <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
