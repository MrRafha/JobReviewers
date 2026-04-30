import Link from "next/link";

import { Container, Footer, Navbar } from "@/components/layout";
import FadeIn from "@/components/ui/FadeIn";

export const metadata = {
  title: "Sobre & Regras — JobReviewers",
  description:
    "Saiba como o JobReviewers funciona, nossas regras de uso, política anti-doxxing e como denunciar conteúdo inadequado.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[var(--border)] pb-10 last:border-none last:pb-0">
      <h2 className="font-sora text-2xl font-bold text-[var(--text-primary)] mb-4">
        {title}
      </h2>
      <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Rule({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] px-5 py-4">
      <span className="text-2xl leading-none mt-0.5">{icon}</span>
      <div>
        <p className="font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <Container size="md">
          <FadeIn direction="up" duration={600}>
            <div className="text-center mb-12">
              <h1 className="font-sora text-4xl font-bold text-[var(--text-primary)] mb-4">
                Sobre & Regras
              </h1>
              <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
                Transparência com responsabilidade. Entenda como o JobReviewers
                funciona e o que esperamos de cada usuário.
              </p>
            </div>
          </FadeIn>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm space-y-10">

            <FadeIn direction="up" delay={100} duration={600}>
              <Section title="Como funciona">
                <p>
                  O JobReviewers é uma plataforma de avaliações anônimas sobre
                  empresas. Qualquer profissional pode criar uma conta e publicar
                  sua experiência de trabalho — sem precisar revelar sua
                  identidade.
                </p>
                <p>
                  Cada review inclui cargo, senioridade, tipo de contrato, modo
                  de trabalho, avaliação geral e comentários sobre pontos
                  positivos e negativos. As avaliações são públicas e visíveis
                  para todos os visitantes.
                </p>
                <p>
                  Empresas são criadas automaticamente quando alguém publica uma
                  review com um nome ainda não cadastrado. Nosso time pode
                  moderar ou ocultar avaliações que violem estas regras.
                </p>
              </Section>
            </FadeIn>

            <FadeIn direction="up" delay={150} duration={600}>
              <Section title="Regras de uso">
                <div className="space-y-3">
                  <Rule
                    icon="✅"
                    title="Seja honesto e construtivo"
                    description="Escreva sobre experiências reais. Críticas são bem-vindas, desde que baseadas em fatos e com linguagem respeitosa."
                  />
                  <Rule
                    icon="🚫"
                    title="Sem identificação de pessoas"
                    description="Não cite nomes de colegas, gestores ou qualquer pessoa específica. Fale sobre processos e cultura, não sobre indivíduos."
                  />
                  <Rule
                    icon="🔗"
                    title="Sem links ou contatos externos"
                    description="Não inclua URLs, e-mails, telefones ou qualquer referência que leve para fora da plataforma."
                  />
                  <Rule
                    icon="⚖️"
                    title="Sem conteúdo ofensivo ou discriminatório"
                    description="Linguagem de ódio, preconceito ou assédio resultará em remoção imediata da review e banimento da conta."
                  />
                  <Rule
                    icon="📋"
                    title="Uma review por empresa por conta"
                    description="Para manter a integridade da plataforma, cada usuário pode publicar uma avaliação por empresa."
                  />
                </div>
              </Section>
            </FadeIn>

            <FadeIn direction="up" delay={200} duration={600}>
              <Section title="Política anti-doxxing">
                <p>
                  O JobReviewers leva a privacidade a sério — tanto dos
                  colaboradores quanto das empresas. Doxxing é a prática de
                  expor informações pessoais identificáveis de alguém sem seu
                  consentimento, e é estritamente proibido aqui.
                </p>
                <div className="rounded-xl bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] px-5 py-4 space-y-1">
                  <p className="font-semibold text-[var(--text-primary)]">
                    São automaticamente bloqueados em reviews:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>Endereços de e-mail</li>
                    <li>Números de telefone</li>
                    <li>CPF ou outros documentos pessoais</li>
                    <li>Links e URLs externas</li>
                  </ul>
                </div>
                <p>
                  Além do bloqueio automático, nossa equipe de moderação revisa
                  denúncias e pode ocultar qualquer conteúdo que identifique
                  pessoas, mesmo que não seja detectado pelo filtro automático.
                </p>
              </Section>
            </FadeIn>

            <FadeIn direction="up" delay={250} duration={600}>
              <Section title="Como denunciar">
                <p>
                  Encontrou uma review que viola nossas regras? Você pode
                  denunciá-la diretamente na página da empresa, clicando no
                  botão de denúncia ao lado da avaliação.
                </p>
                <p>
                  Nossa equipe analisa todas as denúncias e toma as medidas
                  cabíveis: ocultação da review, aviso ao autor ou banimento da
                  conta, dependendo da gravidade.
                </p>
                <div className="rounded-xl bg-[rgba(37,99,235,0.06)] border border-[rgba(37,99,235,0.2)] px-5 py-4">
                  <p className="text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Tempo de resposta:
                    </span>{" "}
                    Denúncias são analisadas em até 48 horas. Casos graves são
                    tratados com prioridade.
                  </p>
                </div>
              </Section>
            </FadeIn>

            <FadeIn direction="up" delay={300} duration={600}>
              <Section title="Contato">
                <p>
                  Dúvidas, sugestões ou problemas que não se encaixam no fluxo
                  de denúncia? Entre em contato com nossa equipe pelo e-mail
                  indicado na página de{" "}
                  <Link
                    href="/contact"
                    className="text-[var(--brand-primary)] hover:underline font-medium"
                  >
                    contato
                  </Link>
                  .
                </p>
              </Section>
            </FadeIn>

          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
