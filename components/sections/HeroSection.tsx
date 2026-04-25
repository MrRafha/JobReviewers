"use client";

import React, { useRef, useState, useCallback } from "react";
import { Container } from "@/components/layout";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchValue: string;
  onSearchInputChange: (value: string) => void;
}

// Posição base de cada janela e força de repulsão individual
const WINDOWS = [
  { id: "A", baseX: 0,   baseY: 4,    rotate: -3, strength: 0.18, zIndex: 1  },
  { id: "B", baseX: 48,  baseY: 0,    rotate:  2, strength: 0.14, zIndex: 2  },
  { id: "C", baseX: 8,   baseY: 30,   rotate:  0, strength: 0.08, zIndex: 10 },
  { id: "D", baseX: 50,  baseY: 68,   rotate:  3, strength: 0.20, zIndex: 1  },
] as const;

export default function HeroSection({
  onSearch,
  searchValue,
  onSearchInputChange,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // dx/dy de repulsão suavizado para cada janela
  const [offsets, setOffsets] = useState(() =>
    Object.fromEntries(WINDOWS.map((w) => [w.id, { x: 0, y: 0 }]))
  );
  const targetOffsets = useRef(
    Object.fromEntries(WINDOWS.map((w) => [w.id, { x: 0, y: 0 }]))
  );
  const currentOffsets = useRef(
    Object.fromEntries(WINDOWS.map((w) => [w.id, { x: 0, y: 0 }]))
  );

  const animating = useRef(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const startLoop = useCallback(() => {
    if (animating.current) return;
    animating.current = true;

    const tick = () => {
      let dirty = false;
      const next: typeof offsets = {} as typeof offsets;

      for (const w of WINDOWS) {
        const cx = lerp(currentOffsets.current[w.id].x, targetOffsets.current[w.id].x, 0.08);
        const cy = lerp(currentOffsets.current[w.id].y, targetOffsets.current[w.id].y, 0.08);

        if (
          Math.abs(cx - currentOffsets.current[w.id].x) > 0.01 ||
          Math.abs(cy - currentOffsets.current[w.id].y) > 0.01
        ) dirty = true;

        currentOffsets.current[w.id] = { x: cx, y: cy };
        next[w.id] = { x: cx, y: cy };
      }

      setOffsets({ ...next });

      if (dirty) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        animating.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // posição do mouse relativa ao container (0-1)
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;

      for (const w of WINDOWS) {
        // centro base da janela em fração do container
        const wx = (w.baseX + 25) / 100;
        const wy = (w.baseY + 15) / 100;

        const dx = wx - mx;
        const dy = wy - my;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

        // repulsão inversamente proporcional à distância, limitada a 28px
        const force = Math.min(w.strength / (dist * dist), 28);
        targetOffsets.current[w.id] = {
          x: (dx / dist) * force,
          y: (dy / dist) * force,
        };
      }

      startLoop();
    },
    [startLoop]
  );

  const handleMouseLeave = useCallback(() => {
    for (const w of WINDOWS) {
      targetOffsets.current[w.id] = { x: 0, y: 0 };
    }
    startLoop();
  }, [startLoop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,#e0e7ff,transparent_38%),radial-gradient(circle_at_80%_20%,#ede9fe,transparent_36%),#fafafa]" />

      <Container className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left: Content */}
        <div>
          <h1 className="font-sora text-4xl font-bold leading-tight text-[var(--text-primary)] sm:text-5xl lg:text-[52px]">
            Descubra a Verdade Sobre Empresas
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Leia avaliações reais de profissionais e entenda como é o dia a dia
            nas empresas antes de tomar sua próxima decisão.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <label htmlFor="hero-company-search" className="sr-only">
              Pesquisar empresas
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="hero-company-search"
                type="text"
                value={searchValue}
                onChange={(event) => onSearchInputChange(event.target.value)}
                placeholder="Pesquise por empresa, cidade ou estado"
                className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-[15px] text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[rgba(37,99,235,0.2)]"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--brand-primary)] px-6 font-semibold text-white transition hover:bg-[var(--brand-primary-hover)]"
              >
                Pesquisar Empresas
              </button>
            </div>
          </form>

          {/* CTAs */}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/reviews/new"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-6 font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-subtle)]"
            >
              Faça sua Avaliação
            </a>
            <a
              href="#como-funciona"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-transparent px-3 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              Como funciona
            </a>
          </div>
        </div>

        {/* Right: Illustration — scattered browser windows with repulsion */}
        <div
          ref={containerRef}
          className="relative mx-auto h-[420px] w-full max-w-[480px] select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Window A — canto superior esquerdo */}
          <div
            className="absolute left-0 top-4 w-[58%] rounded-[18px] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
            style={{
              zIndex: 1,
              transform: `translate(${offsets.A.x}px, ${offsets.A.y}px) rotate(-3deg)`,
              transition: "box-shadow 0.2s",
            }}
          >
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" aria-hidden="true" />
              <div className="ml-2 h-2 w-20 rounded-full bg-[#e2e8f0]" />
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-[#dbeafe] flex-shrink-0 flex items-center justify-center">
                  <span style={{fontSize:12, color:'var(--brand-primary)', fontWeight:700}}>TC</span>
                </div>
                <div>
                  <p style={{fontSize:11, fontWeight:600, color:'var(--text-primary)', lineHeight:1.2}}>TechCorp Brasil</p>
                  <p style={{fontSize:10, color:'var(--text-secondary)'}}>São Paulo, SP</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{fontSize:10, color: s<=4 ? '#fbbf24' : '#e5e7eb'}}>★</span>
                ))}
                <span style={{fontSize:10, fontWeight:600, color:'var(--text-primary)', marginLeft:2}}>4.2</span>
              </div>
            </div>
          </div>

          {/* Window B — canto superior direito */}
          <div
            className="absolute right-0 top-0 w-[52%] rounded-[18px] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            style={{
              zIndex: 2,
              transform: `translate(${offsets.B.x}px, ${offsets.B.y}px) rotate(2deg)`,
            }}
          >
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" aria-hidden="true" />
              <div className="ml-2 h-2 w-16 rounded-full bg-[#dbeafe]" />
            </div>
            <div className="mt-1.5 rounded-lg border border-[#dbeafe] bg-[#f0f7ff] p-2">
              <p style={{fontSize:9, fontWeight:600, color:'var(--brand-primary)', marginBottom:2}}>Nova avaliação</p>
              <p style={{fontSize:9, color:'var(--text-secondary)', lineHeight:1.4}}>
                "Ótimo ambiente e cultura forte de eng..."
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{fontSize:9, color:'#fbbf24'}}>★</span>
                ))}
              </div>
            </div>
          </div>

          {/* Window C — centro, principal */}
          <div
            className="absolute left-[8%] top-[30%] w-[84%] rounded-[22px] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.11)]"
            style={{
              zIndex: 10,
              transform: `translate(${offsets.C.x}px, ${offsets.C.y}px) rotate(0deg)`,
            }}
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
              <div className="mb-4 flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ef4444]" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-[#f59e0b]" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-[#22c55e]" aria-hidden="true" />
                <div className="ml-2 h-2 w-24 rounded-full bg-[#dbeafe]" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full rounded-full bg-[#d1d5db]" />
                <div className="h-2 w-10/12 rounded-full bg-[#d1d5db]" />
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-[#dbeafe] bg-white p-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Classificação em tempo real
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Avaliações anônimas
                  </p>
                </div>
                <div className="text-2xl font-bold text-[#fbbf24]">★ 4.8</div>
              </div>
              <div className="mt-3 flex items-end gap-0.5 h-4">
                {[65,20,8,4,3].map((pct, i) => {
                  const colors = ['#22c55e','#84cc16','#facc15','#fb923c','#f87171'];
                  return (
                    <div key={i} style={{flex:1, borderRadius:2, background:colors[i], opacity:0.8, height:`${Math.max(pct,8)}%`}} />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Window D — canto inferior direito */}
          <div
            className="absolute bottom-0 right-2 w-[50%] rounded-[18px] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
            style={{
              zIndex: 1,
              transform: `translate(${offsets.D.x}px, ${offsets.D.y}px) rotate(3deg)`,
            }}
          >
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" aria-hidden="true" />
              <div className="ml-2 h-2 w-14 rounded-full bg-[#e2e8f0]" />
            </div>
            <div className="mt-1.5 space-y-1.5">
              <div className="rounded-lg bg-[var(--bg-subtle)] p-1.5">
                <p style={{fontSize:9, fontWeight:600, color:'var(--text-primary)'}}>Nubank</p>
                <div className="flex items-center gap-1">
                  <span style={{fontSize:9, color:'#fbbf24'}}>★</span>
                  <span style={{fontSize:9, color:'var(--text-secondary)'}}>4.7 · 142 avaliações</span>
                </div>
              </div>
              <div className="rounded-lg bg-[var(--bg-subtle)] p-1.5">
                <p style={{fontSize:9, fontWeight:600, color:'var(--text-primary)'}}>iFood</p>
                <div className="flex items-center gap-1">
                  <span style={{fontSize:9, color:'#fbbf24'}}>★</span>
                  <span style={{fontSize:9, color:'var(--text-secondary)'}}>4.1 · 89 avaliações</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
