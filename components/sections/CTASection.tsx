"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout";

// Sequência:
// "idle"    → só o foguete grande visível, sem card ao redor
// "border"  → borda azul aparece ao redor do foguete (card ainda pequeno/transparente)
// "expand"  → card expande ao redor do foguete, foguete encolhe para ícone pequeno
// "content" → texto e botões entram em cascata
type Phase = "idle" | "border" | "expand" | "content";

const KEYFRAMES = `
@keyframes rocketGlow {
  0%   { box-shadow: 0 0 0px 0px rgba(37,99,235,0);    transform: scale(1); }
  50%  { box-shadow: 0 0 18px 6px rgba(37,99,235,0.35); transform: scale(1.12); }
  100% { box-shadow: 0 0 0px 0px rgba(37,99,235,0);    transform: scale(1); }
}
`;

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const triggered = useRef(false);
  const styleInjected = useRef(false);

  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const tag = document.createElement("style");
    tag.textContent = KEYFRAMES;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          observer.disconnect();

          setTimeout(() => setPhase("border"),  150);   // borda azul aparece
          setTimeout(() => setPhase("expand"),  500);   // card expande, foguete encolhe
          setTimeout(() => setPhase("content"), 900);   // texto e botões entram
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasBorder  = phase === "border" || phase === "expand" || phase === "content";
  const hasCard    = phase === "expand"  || phase === "content";
  const hasContent = phase === "content";
  const isSmall    = phase === "expand"  || phase === "content";

  return (
    <section className="px-4 pb-16 sm:pb-20" ref={sectionRef}>
      <Container>
        {/* Wrapper relativo para o foguete poder flutuar acima do card */}
        <div className="relative flex flex-col items-center">

          {/* Foguete — sempre visível, posicionado acima do card */}
          <div
            aria-hidden="true"
            style={{
              position:       "relative",
              zIndex:         10,
              display:        "inline-flex",
              alignItems:     "center",
              justifyContent: "center",
              borderRadius:   "1rem",
              background:     "#dbeafe",
              color:          "var(--brand-primary)",
              width:          isSmall ? 66  : 82,
              height:         isSmall ? 66  : 82,
              marginBottom:   isSmall ? 0   : 0,
              // Quando o card aparece o foguete já está na posição de ícone
              transform:      hasCard ? "translateY(0)" : "translateY(0)",
              animation:      !hasCard ? "rocketGlow 0.65s ease-in-out infinite" : "none",
              outline:        hasBorder && !hasCard
                ? "2px solid var(--brand-primary)"
                : "none",
              outlineOffset:  "4px",
              transition: [
                "width 500ms cubic-bezier(0.34,1.2,0.64,1)",
                "height 500ms cubic-bezier(0.34,1.2,0.64,1)",
                "outline 400ms ease",
                "margin-bottom 500ms ease",
              ].join(", "),
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{
                fontSize:   isSmall ? 34 : 46,
                lineHeight: 1,
                transition: "font-size 500ms cubic-bezier(0.34,1.2,0.64,1)",
              }}
            >
              rocket_launch
            </span>
          </div>

          {/* Card — expande de 0 de altura/opacidade para o tamanho real */}
          <div
            className="w-full rounded-3xl border text-center shadow-sm"
            style={{
              borderColor:    "var(--brand-primary)",
              backgroundColor: "var(--bg-surface)",
              // Empurra o foguete para dentro do card como ícone ao expandir
              marginTop:      hasCard ? -82 : 0,
              paddingTop:     hasCard ? 100 : 0,
              paddingBottom:  hasCard ? 48  : 0,
              paddingLeft:    32,
              paddingRight:   32,
              maxHeight:      hasCard ? 500 : 0,
              opacity:        hasCard ? 1   : 0,
              overflow:       "hidden",
              transition: [
                "max-height 600ms cubic-bezier(0.4,0,0.2,1)",
                "opacity 400ms ease",
                "margin-top 500ms ease",
                "padding-top 500ms ease",
                "padding-bottom 500ms ease",
              ].join(", "),
            }}
          >
            {/* Título */}
            <h2
              className="font-sora text-3xl font-semibold mb-4 sm:text-4xl"
              style={{
                color:      "var(--text-primary)",
                opacity:    hasContent ? 1 : 0,
                transform:  hasContent ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 500ms ease 80ms, transform 500ms ease 80ms",
              }}
            >
              Comece Agora
            </h2>

            {/* Subtítulo */}
            <p
              className="text-lg mb-8 max-w-2xl mx-auto"
              style={{
                color:      "var(--text-secondary)",
                opacity:    hasContent ? 1 : 0,
                transform:  hasContent ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 500ms ease 200ms, transform 500ms ease 200ms",
              }}
            >
              Junte-se a profissionais que buscam transparência no mercado de trabalho.
            </p>

            {/* Botões */}
            <div
              className="flex flex-col gap-4 sm:flex-row justify-center sm:gap-4"
              style={{
                opacity:    hasContent ? 1 : 0,
                transform:  hasContent ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 500ms ease 340ms, transform 500ms ease 340ms",
              }}
            >
              <Link
                href="/companies"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] text-white px-8 font-semibold transition hover:bg-[var(--brand-primary-hover)] active:scale-95 active:brightness-95"
              >
                <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
                  business
                </span>
                Explorar Empresas
              </Link>

              <Link
                href="/reviews/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-primary)] px-8 font-semibold transition hover:bg-[var(--bg-subtle)] active:scale-95 active:brightness-95"
              >
                <span className="material-symbols-rounded text-[20px] text-[var(--brand-primary)]" aria-hidden="true">
                  edit_square
                </span>
                Escrever Avaliação
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
