"use client";

import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function ComingSoonPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FFFDF6] text-[#960C3F] flex flex-col items-center justify-center px-6 py-16 selection:bg-[#CA5254] selection:text-[#FFFDF6]">
      {/* Decorative background subtle dots pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="dot-pattern"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="16" cy="16" r="1.5" fill="#960C3F" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl text-center flex flex-col items-center"
      >
        {/* Logo */}
        <motion.img
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          src="/logo.png"
          alt="Poleczka — Bistro Kuchnia Polska"
          className="h-28 sm:h-36 md:h-44 w-auto mb-10 transition-transform duration-500 hover:scale-105"
        />

        {/* Subtitle tag */}
        <span className="mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#D9A261]">
          Stefana Jaracza 77B Wrocław
        </span>

        {/* Main Title */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-[#960C3F] mb-6">
          Bistro Poleczka. Wkrótce otwarcie.
        </h1>

        <Separator className="w-24 bg-[#D9A261]/50 mb-8" />

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg md:text-xl text-[#960C3F]/80 leading-relaxed font-sans max-w-lg mx-auto">
          Trwają ostatnie przygotowania. Do zobaczenia w sierpniu na obiadku!
        </p>

        {/* Footer note */}
        <div className="mt-16 text-xs tracking-widest uppercase text-[#A6A6A6]">
          &copy; {new Date().getFullYear()} Bistro Poleczka
        </div>
      </motion.div>
    </div>
  );
}
