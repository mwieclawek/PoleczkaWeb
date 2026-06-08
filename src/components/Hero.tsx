import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative min-h-[100dvh] w-full bg-background flex flex-col overflow-hidden">

      {/* ── Absolute badge: Wielkie otwarcie ── */}
      <motion.div
        className="absolute top-[22%] right-8 md:right-16 z-10 border border-secondary/25 px-5 py-4 max-w-[180px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4 }}
      >
        <p className="text-[9px] tracking-[0.3em] uppercase text-secondary/40 font-sans mb-1.5">Informacja</p>
        <p className="text-xs font-sans font-semibold text-secondary leading-snug tracking-wide">
          Wielkie otwarcie
        </p>
        <p className="text-xs font-sans text-secondary/60 tracking-wide">Lipiec 2026</p>
      </motion.div>

      {/* ── Side index: vertical text ── */}
      <motion.div
        className="absolute right-8 md:right-16 bottom-32 flex-col items-center gap-3 hidden lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <div className="w-px h-16 bg-secondary/15" />
        <span className="text-[9px] tracking-[0.35em] uppercase text-secondary/25 font-sans [writing-mode:vertical-rl] rotate-180">
          2026 · № 01
        </span>
        <div className="w-px h-16 bg-secondary/15" />
      </motion.div>

      {/* ── Main layout ── */}
      <div className="flex-1 flex flex-col px-8 md:px-12 lg:px-16 pt-32 pb-0">

        {/* Row 1: logo mark + category label */}
        <motion.div
          className="flex items-center gap-5 mb-auto"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {/* Rosette logo mark — larger, prominent in hero */}
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <circle cx="16" cy="16" r="15" fill="hsl(229 83% 37%)" />
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={16 + 5 * Math.cos(rad)} y1={16 + 5 * Math.sin(rad)}
                  x2={16 + 13 * Math.cos(rad)} y2={16 + 13 * Math.sin(rad)}
                  stroke="white" strokeWidth="1.4" strokeLinecap="round"
                />
              );
            })}
            <circle cx="16" cy="16" r="3.5" fill="white" />
            <circle cx="16" cy="16" r="1.8" fill="hsl(229 83% 37%)" />
          </svg>
          <div className="w-px h-6 bg-secondary/15" />
          <span className="text-[10px] tracking-[0.28em] uppercase text-secondary/50 font-sans">
            Autorska kuchnia polska
          </span>
        </motion.div>

        {/* Row 2: the massive headline — anchored to bottom */}
        <div className="flex-1 flex items-end pb-0 mt-12 md:mt-0">
          <div className="w-full overflow-hidden">
            <motion.h1
              className="font-serif font-bold text-secondary leading-[0.85] tracking-tight"
              style={{ fontSize: 'clamp(5rem, 16.5vw, 18rem)' }}
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Poleczka
            </motion.h1>
          </div>
        </div>
      </div>

      {/* ── Full-width rule ── */}
      <motion.div
        className="w-full h-px bg-secondary/15 mx-0"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── Bottom 3-col row ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 px-8 md:px-12 lg:px-16 py-8 gap-6 md:gap-0"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1 }}
      >
        {/* Col 1: description */}
        <div className="flex flex-col justify-center md:pr-12 md:border-r border-secondary/10">
          <p className="text-sm font-sans text-secondary/60 leading-relaxed max-w-xs">
            Menu tworzone w rytmie pór roku. Lokalni producenci, dolnośląskie składniki, nowe myślenie o klasyce.
          </p>
        </div>

        {/* Col 2: location data */}
        <div className="flex flex-col justify-center md:px-12 md:border-r border-secondary/10">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.25em] uppercase text-secondary/30 font-sans">Lokalizacja</p>
            <p className="text-sm font-sans font-medium text-secondary">ul. Świdnicka 28</p>
            <p className="text-sm font-sans text-secondary/50">Wrocław, Polska</p>
          </div>
        </div>

        {/* Col 3: CTAs */}
        <div className="flex flex-col justify-center gap-3 md:pl-12">
          <button
            onClick={() => scrollTo('reservation')}
            className="inline-flex items-center justify-between bg-primary text-primary-foreground px-6 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans font-semibold hover:bg-primary/90 transition-colors duration-200 group"
            data-testid="button-reserve"
          >
            <span>Rezerwacja stolika</span>
            <span className="ml-4 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </button>
          <button
            onClick={() => scrollTo('menu')}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-sans font-medium text-secondary/40 hover:text-secondary transition-colors duration-200 border border-secondary/15 px-6 py-3.5 hover:border-secondary/30"
            data-testid="button-see-menu"
          >
            <span>Zobacz menu</span>
            <span className="text-secondary/25">↗</span>
          </button>
        </div>
      </motion.div>

    </section>
  );
}
