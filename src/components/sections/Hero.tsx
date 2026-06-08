"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, MapPin, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F9F3DB]"
    >
      {/* Gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-[#F9F3DB]/80" />

      {/* Subtle grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

      {/* Decorative botanical-inspired circles */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.08 }}
        transition={{ duration: 1.5, ease: "easeOut" as const }}
        className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full border border-[#CA5254]"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 1.8, ease: "easeOut" as const, delay: 0.3 }}
        className="absolute -bottom-48 -left-48 h-[800px] w-[800px] rounded-full border border-[#1028AB]"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 2, ease: "easeOut" as const, delay: 0.5 }}
        className="absolute top-1/4 -left-20 h-[400px] w-[400px] rounded-full bg-[#D9A261]"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center mt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#A6A6A6]/20 bg-white/40 px-5 py-2.5 text-sm text-[#1028AB]/80 backdrop-blur-sm"
        >
          <MapPin className="h-3.5 w-3.5 text-[#CA5254]" />
          <span>Wrocław · ul. Stefana Jaracza 77B</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 font-heading text-6xl font-bold leading-tight tracking-tight text-[#CA5254] md:text-7xl lg:text-9xl"
        >
          Poleczka
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mx-auto mb-2 text-sm font-medium uppercase tracking-[0.3em] text-[#D9A261]"
        >
          Nowoczesna kuchnia polska
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#A6A6A6] md:text-xl"
        >
          Tradycyjne, lokalne składniki w nowym wydaniu. Klasyka spotyka się
          z&nbsp;finezją w&nbsp;sercu Wrocławia.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="#menu"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#CA5254] px-8 text-base font-semibold text-[#F9F3DB] shadow-lg shadow-[#CA5254]/20 transition-all hover:bg-[#1028AB] hover:shadow-xl hover:shadow-[#1028AB]/30"
          >
            Zobacz Menu
          </Link>
          <Link
            href="#contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#1028AB]/20 px-8 text-base font-medium text-[#1028AB] transition-colors hover:bg-[#1028AB]/5"
          >
            Zarezerwuj Stolik
          </Link>
        </motion.div>

        {/* Info pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-[#A6A6A6]"
        >
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#D9A261]" />
            Wt–Pt 12:00–22:00
          </span>
          <span className="hidden h-4 w-px bg-[#A6A6A6]/30 sm:block" />
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#D9A261]" />
            Sob–Ndz 12:00–23:00
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" as const }}
        >
          <ArrowDown className="h-5 w-5 text-[#1028AB]/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
