"use client";

import { useState } from "react";

import Link from "next/link";

export default function AboutPage() {
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Hero Section */}
      <div className="bg-[#2B2D31] rounded-b-[40px] shadow-xl h-[380px] relative overflow-hidden">
        {/* Glow sutil azul (esquerda) */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2563EB] opacity-[0.08] blur-[120px] rounded-full"></div>
        {/* Glow sutil verde (direita) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E] opacity-[0.08] blur-[120px] rounded-full"></div>

        <div className="flex flex-col items-center justify-center px-4 h-full relative z-10">
          {/* Logo JR - Clicável */}
          <Link href="/" className="mb-6 transition-transform hover:scale-105">
            <img
              src="/logo.png"
              alt="JobReviewers Logo"
              className="h-20 w-28"
            />
          </Link>

          {/* Título */}
          <h1 className="font-sora text-4xl font-bold text-white mb-3">
            Sobre o JobReviewers
          </h1>

          {/* Subtítulo */}
          <p
            className="text-center text-white text-lg font-normal tracking-wide max-w-2xl"
            style={{ opacity: 0.85 }}
          >
            Conheça nossa missão e as regras da plataforma
          </p>
        </div>
      </div>

      {/* Seção: Nossa Missão */}
      <div className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sora text-3xl font-bold text-[#0F172A] mb-6 text-center">
            Nossa Missão
          </h2>
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
            <p className="text-[#334155] text-lg leading-relaxed mb-4">
              O{" "}
              <span className="font-semibold text-[#2563EB]">JobReviewers</span>{" "}
              é uma plataforma criada para profissionais compartilharem suas
              experiências de trabalho de forma{" "}
              <span className="font-semibold">anônima</span> e
              <span className="font-semibold"> responsável</span>.
            </p>
            <p className="text-[#334155] text-lg leading-relaxed mb-4">
              Nosso objetivo é ajudar pessoas a tomarem decisões mais informadas
              sobre suas carreiras, reduzindo "furadas" e promovendo
              transparência no mercado de trabalho.
            </p>
            <p className="text-[#334155] text-lg leading-relaxed">
              Acreditamos que compartilhar conhecimento sobre empresas, cultura
              organizacional e processos seletivos beneficia toda a comunidade
              profissional.
            </p>
          </div>
        </div>
      </div>

      {/* Seção: Nossos Princípios */}
      <div className="bg-[#2B2D31] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora text-3xl font-bold text-white text-center mb-12">
            Nossos Princípios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Princípio 1 - Anonimato */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all hover:bg-white/15">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-[#2563EB]/[0.03] rounded-full flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-sora text-lg font-semibold text-white mb-2 text-center">
                Anonimato
              </h3>
              <p className="text-white/80 text-sm leading-relaxed text-center">
                Sua identidade é protegida. Você aparece como um apelido, nunca
                com dados pessoais.
              </p>
            </div>

            {/* Princípio 2 - Credibilidade */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all hover:bg-white/15">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-[#22C55E]/[0.03] rounded-full flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-sora text-lg font-semibold text-white mb-2 text-center">
                Credibilidade
              </h3>
              <p className="text-white/80 text-sm leading-relaxed text-center">
                Contas verificadas por e-mail garantem autenticidade nas
                avaliações.
              </p>
            </div>

            {/* Princípio 3 - Segurança */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all hover:bg-white/15">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-[#2563EB]/[0.03] rounded-full flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-sora text-lg font-semibold text-white mb-2 text-center">
                Segurança
              </h3>
              <p className="text-white/80 text-sm leading-relaxed text-center">
                Proibido compartilhar dados pessoais e nomes de indivíduos.
              </p>
            </div>

            {/* Princípio 4 - Moderação */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all hover:bg-white/15">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-[#22C55E]/[0.03] rounded-full flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-sora text-lg font-semibold text-white mb-2 text-center">
                Moderação
              </h3>
              <p className="text-white/80 text-sm leading-relaxed text-center">
                Sistema de denúncias e moderação ativa para manter a qualidade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção: Regras de Publicação */}
      <div className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sora text-3xl font-bold text-[#0F172A] mb-6 text-center">
            Regras de Publicação
          </h2>

          {/* O que é proibido */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-[#EF4444]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5 text-[#EF4444]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-sora text-xl font-semibold text-[#EF4444] mb-3">
                  ❌ É proibido
                </h3>
                <ul className="space-y-2 text-[#334155]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444] font-bold">•</span>
                    <span>
                      Citar nomes de pessoas (chefes, RH, colegas, gestores)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444] font-bold">•</span>
                    <span>
                      Expor dados pessoais (telefone, e-mail, CPF, endereço)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444] font-bold">•</span>
                    <span>Fazer acusações criminais sem evidências</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444] font-bold">•</span>
                    <span>
                      Publicar segredos internos, dados de clientes ou
                      documentos privados
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* O que você pode fazer */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-[#22C55E]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5 text-[#22C55E]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-sora text-xl font-semibold text-[#22C55E] mb-3">
                  ✅ Você pode criticar
                </h3>
                <ul className="space-y-2 text-[#334155]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">•</span>
                    <span>Processos e metodologias de trabalho</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">•</span>
                    <span>Cultura organizacional e ambiente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">•</span>
                    <span>Estilo de gestão (sem citar nomes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">•</span>
                    <span>Carga de trabalho e equilíbrio vida-trabalho</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">•</span>
                    <span>Benefícios oferecidos pela empresa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">•</span>
                    <span>
                      Faixas salariais (nunca valores exatos com identificação)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção: Política de Uso */}
      <div className="bg-[#F1F5F9] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sora text-3xl font-bold text-[#0F172A] mb-6 text-center">
            Política de Uso
          </h2>

          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm space-y-6">
            {/* Verificação de E-mail */}
            <div>
              <h3 className="font-sora text-lg font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
                <span className="text-[#2563EB]">📧</span>
                Verificação de E-mail
              </h3>
              <p className="text-[#334155] leading-relaxed">
                Para publicar reviews, você deve confirmar seu e-mail. Isso
                garante credibilidade e evita contas falsas, mantendo a
                qualidade da plataforma.
              </p>
            </div>

            {/* Edição de Reviews */}
            <div>
              <h3 className="font-sora text-lg font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
                <span className="text-[#2563EB]">✏️</span>
                Edição de Reviews
              </h3>
              <p className="text-[#334155] leading-relaxed">
                Você pode editar sua review por até{" "}
                <span className="font-semibold">15 minutos</span> após a
                publicação. Após esse período, a review fica permanente (salvo
                em casos de denúncia procedente).
              </p>
            </div>

            {/* Sistema de Denúncias */}
            <div>
              <h3 className="font-sora text-lg font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
                <span className="text-[#EA580C]">🚨</span>
                Sistema de Denúncias
              </h3>
              <p className="text-[#334155] leading-relaxed">
                Se você encontrar conteúdo que viole nossas regras, pode
                denunciá-lo. Nossa equipe de moderação analisa todas as
                denúncias e toma as medidas apropriadas.
              </p>
            </div>

            {/* Responsabilidade */}
            <div>
              <h3 className="font-sora text-lg font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
                <span className="text-[#22C55E]">⚖️</span>
                Responsabilidade
              </h3>
              <p className="text-[#334155] leading-relaxed">
                Ao publicar uma review, você concorda em compartilhar
                experiências verídicas e construtivas. Reviews que violem nossas
                regras podem ser ocultadas ou removidas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-sora text-3xl font-bold text-[#0F172A] mb-4">
            Pronto para começar?
          </h2>
          <p className="text-[#64748B] text-lg mb-8">
            Compartilhe sua experiência ou descubra reviews de empresas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reviews/new"
              className="inline-block px-8 py-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-2xl shadow-lg transition-all hover:scale-105"
            >
              Escrever Review
            </Link>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-2xl shadow-lg transition-all hover:scale-105"
            >
              Ver Empresas
            </Link>
          </div>
        </div>
      </div>

      {/* Botão Fixo - Avisos Legais */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Anel de pulso animado */}
        <div className="absolute inset-0 bg-[#2563EB] rounded-full animate-ping opacity-20"></div>

        <button
          onClick={() => setIsLegalModalOpen(true)}
          className="relative w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
          title="Avisos Legais"
        >
          {/* Brilho interno */}
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <svg
            className="w-7 h-7 relative z-10"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>

          {/* Badge de notificação */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </button>
      </div>

      {/* Modal - Avisos Legais */}
      {isLegalModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setIsLegalModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="sticky top-0 bg-[#2B2D31] rounded-t-3xl px-8 py-6 flex items-center justify-between z-10">
              <h2 className="font-sora text-2xl font-bold text-white">
                ⚖️ Avisos Legais
              </h2>
              <button
                onClick={() => setIsLegalModalOpen(false)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-8 space-y-6">
              {/* Aviso Importante */}
              <div className="bg-[#EF4444]/10 border-2 border-[#EF4444] rounded-2xl p-6">
                <p className="text-[#EF4444] font-semibold text-lg text-center">
                  ⚠️ Você não pode expor dados privados de terceiros. Se fizer
                  isso para intimidar, comete crime de Cyberbullying (Art.
                  146-A); se fizer para perseguir, comete crime de Stalking
                  (Art. 147-A). Ambas as condutas dão cadeia.
                </p>
              </div>

              {/* Lei 1 - Cyberbullying */}
              <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#2563EB]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📜</span>
                  </div>
                  <div>
                    <h3 className="font-sora text-xl font-bold text-[#0F172A] mb-2">
                      1. Lei do Cyberbullying (Lei nº 14.811/2024)
                    </h3>
                    <p className="text-[#334155] text-sm leading-relaxed mb-3">
                      Esta lei incluiu o Art. 146-A no Código Penal. É o
                      enquadramento mais comum hoje para doxxing feito para
                      humilhar ou intimidar.
                    </p>
                  </div>
                </div>

                <div className="pl-13 space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#0F172A] mb-1 flex items-center gap-2">
                      <span className="text-[#EF4444]">🚫</span>O que proíbe:
                    </h4>
                    <p className="text-[#334155] leading-relaxed">
                      Intimidar sistematicamente alguém, individualmente ou em
                      grupo, mediante violência psicológica (como a exposição de
                      dados) na internet.
                    </p>
                  </div>

                  <div className="bg-[#EF4444]/5 border-l-4 border-[#EF4444] p-4 rounded">
                    <h4 className="font-semibold text-[#EF4444] mb-1">
                      ⚖️ Pena:
                    </h4>
                    <p className="text-[#334155] font-medium">
                      Reclusão de 2 a 4 anos, além de multa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lei 2 - Stalking */}
              <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#2563EB]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📜</span>
                  </div>
                  <div>
                    <h3 className="font-sora text-xl font-bold text-[#0F172A] mb-2">
                      2. Lei do Stalking (Lei nº 14.132/2021)
                    </h3>
                    <p className="text-[#334155] text-sm leading-relaxed mb-3">
                      Se o vazamento de dados for usado para perseguir a vítima
                      obsessivamente, o crime é de perseguição (Art. 147-A).
                    </p>
                  </div>
                </div>

                <div className="pl-13 space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#0F172A] mb-1 flex items-center gap-2">
                      <span className="text-[#EF4444]">🚫</span>O que proíbe:
                    </h4>
                    <p className="text-[#334155] leading-relaxed">
                      Perseguir alguém, reiteradamente e por qualquer meio
                      (incluindo online), invadindo ou perturbando sua esfera de
                      privacidade.
                    </p>
                  </div>

                  <div className="bg-[#EF4444]/5 border-l-4 border-[#EF4444] p-4 rounded">
                    <h4 className="font-semibold text-[#EF4444] mb-1">
                      ⚖️ Pena:
                    </h4>
                    <p className="text-[#334155] font-medium">
                      Reclusão de 6 meses a 2 anos (aumentada se feita contra
                      mulheres, crianças ou idosos).
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão Fechar */}
              <div className="pt-4">
                <button
                  onClick={() => setIsLegalModalOpen(false)}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
