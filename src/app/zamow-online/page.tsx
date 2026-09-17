"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ZamowOnlinePage() {
  useEffect(() => {
    // Inject GoOrder script once
    const existingScript = document.querySelector(
      'script[src="https://store.goorder.pl/goorder.js"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://store.goorder.pl/goorder.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col">
      {/* Top accent bar */}
      <div className="h-1.5 bg-[#960C3F] shadow-sm shrink-0" />

      {/* Header */}
      <header className="border-b border-[#960C3F]/10 bg-[#FFFDF6]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#960C3F] hover:text-[#CA5254] transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Powrót do strony
          </Link>

          <Link href="/" className="group flex items-center">
            <img
              src="/logo.png"
              alt="Poleczka — Bistro Kuchnia Polska"
              className="h-12 w-auto md:h-16 transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>
      </header>

      {/* Page title */}
      <div className="text-center py-8 md:py-12 bg-gradient-to-b from-[#960C3F]/[0.03] to-transparent">
        <span className="inline-block text-xs font-bold tracking-widest text-[#D9A261] uppercase mb-3">
          Dostawa &amp; Odbiór osobisty
        </span>
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#960C3F] mb-3">
          Zamów online
        </h1>
        <p className="text-[#960C3F]/60 max-w-lg mx-auto text-sm md:text-base px-4">
          Wybierz dania z naszego menu i zamów z dostawą lub odbiorem osobistym
        </p>
      </div>

      {/* GoOrder embedded widget */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-2xl border border-[#960C3F]/10 bg-white shadow-lg shadow-[#960C3F]/5 overflow-hidden min-h-[600px]">
          <div
            className="goorder w-full"
            data-src="https://BistroPoleczka.goorder.pl/widget?grid=1"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#960C3F]/10 py-6 text-center">
        <p className="text-xs text-[#960C3F]/40 tracking-wide">
          Szybka dostawa · Bezpieczna płatność online · Odbiór w bistro
        </p>
      </footer>
    </div>
  );
}
