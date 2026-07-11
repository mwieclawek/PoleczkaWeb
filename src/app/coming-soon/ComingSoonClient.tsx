"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/client";

export interface ComingSoonData {
  addressTag?: string;
  mainTitle?: string;
  description?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export const defaultComingSoonData: Required<ComingSoonData> = {
  addressTag: "Stefana Jaracza 77B Wrocław",
  mainTitle: "Bistro Poleczka. Wkrótce otwarcie.",
  description:
    "Trwają ostatnie przygotowania. Do zobaczenia w sierpniu na obiadku!",
  instagramUrl: "https://instagram.com/poleczka.wroclaw",
  facebookUrl: "https://facebook.com/poleczka.wroclaw",
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function ComingSoonClient({
  initialData,
}: {
  initialData: ComingSoonData | null;
}) {
  const [data, setData] = useState<Required<ComingSoonData>>({
    addressTag: initialData?.addressTag || defaultComingSoonData.addressTag,
    mainTitle: initialData?.mainTitle || defaultComingSoonData.mainTitle,
    description: initialData?.description || defaultComingSoonData.description,
    instagramUrl:
      initialData?.instagramUrl || defaultComingSoonData.instagramUrl,
    facebookUrl: initialData?.facebookUrl || defaultComingSoonData.facebookUrl,
  });

  useEffect(() => {
    let isMounted = true;
    client
      .fetch<ComingSoonData | null>(`*[_type == "comingSoon"][0]{
        addressTag,
        mainTitle,
        description,
        instagramUrl,
        facebookUrl
      }`)
      .then((fetched) => {
        if (isMounted && fetched) {
          setData({
            addressTag:
              fetched.addressTag || defaultComingSoonData.addressTag,
            mainTitle: fetched.mainTitle || defaultComingSoonData.mainTitle,
            description:
              fetched.description || defaultComingSoonData.description,
            instagramUrl:
              fetched.instagramUrl || defaultComingSoonData.instagramUrl,
            facebookUrl:
              fetched.facebookUrl || defaultComingSoonData.facebookUrl,
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

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
          {data.addressTag}
        </span>

        {/* Main Title */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-[#960C3F] mb-6">
          {data.mainTitle}
        </h1>

        <Separator className="w-24 bg-[#D9A261]/50 mb-8" />

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg md:text-xl text-[#960C3F]/80 leading-relaxed font-sans max-w-lg mx-auto">
          {data.description}
        </p>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex items-center justify-center gap-5"
        >
          <a
            href={data.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#960C3F]/20 bg-[#960C3F]/5 text-[#960C3F] transition-all duration-300 hover:border-[#CA5254] hover:bg-[#CA5254] hover:text-[#FFFDF6] hover:shadow-lg"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
          </a>
          <a
            href={data.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#960C3F]/20 bg-[#960C3F]/5 text-[#960C3F] transition-all duration-300 hover:border-[#CA5254] hover:bg-[#CA5254] hover:text-[#FFFDF6] hover:shadow-lg"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
          </a>
        </motion.div>

        {/* Footer note */}
        <div className="mt-16 text-xs tracking-widest uppercase text-[#A6A6A6]">
          &copy; {new Date().getFullYear()} Bistro Poleczka
        </div>
      </motion.div>
    </div>
  );
}
