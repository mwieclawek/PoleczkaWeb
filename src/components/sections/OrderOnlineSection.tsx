"use client";

import React from "react";
import Link from "next/link";

export default function OrderOnlineSection() {
  return (
    <section
      id="zamow-online"
      className="py-20 md:py-28 bg-[#FFFDF6] border-t border-[#960C3F]/10 relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_60%_50%,#960C3F,transparent_70%)]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Label */}
        <span className="inline-block text-xs font-bold tracking-widest text-[#D9A261] uppercase mb-4">
          Dostawa &amp; Odbiór osobisty
        </span>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#960C3F] mb-6">
          Zamów online z dostawą
        </h2>

        {/* Description */}
        <p className="text-[#960C3F]/65 max-w-xl mx-auto text-base md:text-lg mb-12 leading-relaxed">
          Skosztuj naszych potraw w zaciszu własnego domu. Wybierz dania
          i zamów z szybką dostawą lub z odbiorem osobistym w bistro.
        </p>

        {/* Link to /zamow-online subpage */}
        <Link
          href="/zamow-online"
          className="inline-flex items-center gap-3 bg-[#960C3F] hover:bg-[#CA5254] text-[#FFFDF6] font-semibold text-lg px-12 py-4 rounded-full shadow-xl shadow-[#960C3F]/25 transition-all duration-200 hover:shadow-2xl hover:shadow-[#960C3F]/30 hover:scale-[1.03] active:scale-100"
        >
          {/* Cart icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
            />
          </svg>
          Zamów online
        </Link>

        {/* Supporting info */}
        <p className="mt-6 text-xs text-[#960C3F]/40 tracking-wide">
          Szybka dostawa · Bezpieczna płatność online · Odbiór w bistro
        </p>
      </div>
    </section>
  );
}
