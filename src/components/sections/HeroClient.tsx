"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { client } from "@/sanity/client";
import { useReservationModal } from "@/components/ReservationModalContext";

export interface HeroData {
  tagline?: string;
  titleLine1?: string;
  titleLine2?: string;
  titleLine3?: string;
  subtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryText?: string;
  ctaSecondaryHref?: string;
}

export const defaultHeroData: Required<HeroData> = {
  tagline: "Wrocław · ul. Jaracza 77B",
  titleLine1: "Polska kuchnia.",
  titleLine2: "Rzemiosło, tradycja,",
  titleLine3: "nowoczesność.",
  subtitle:
    "Autorskie spojrzenie na lokalne produkty. Proste składniki podniesione do rangi sztuki kulinarnej.",
  ctaPrimaryText: "Zobacz menu",
  ctaPrimaryHref: "#menu",
  ctaSecondaryText: "Zarezerwuj stolik",
  ctaSecondaryHref: "#contact",
};

export default function HeroClient({
  initialData,
}: {
  initialData: HeroData | null;
}) {
  const [data, setData] = useState<Required<HeroData>>({
    tagline: initialData?.tagline || defaultHeroData.tagline,
    titleLine1: initialData?.titleLine1 || defaultHeroData.titleLine1,
    titleLine2: initialData?.titleLine2 || defaultHeroData.titleLine2,
    titleLine3: initialData?.titleLine3 || defaultHeroData.titleLine3,
    subtitle: initialData?.subtitle || defaultHeroData.subtitle,
    ctaPrimaryText: initialData?.ctaPrimaryText || defaultHeroData.ctaPrimaryText,
    ctaPrimaryHref: initialData?.ctaPrimaryHref || defaultHeroData.ctaPrimaryHref,
    ctaSecondaryText:
      initialData?.ctaSecondaryText || defaultHeroData.ctaSecondaryText,
    ctaSecondaryHref:
      initialData?.ctaSecondaryHref || defaultHeroData.ctaSecondaryHref,
  });
  const { openModal } = useReservationModal();

  useEffect(() => {
    let isMounted = true;
    client
      .fetch<HeroData | null>(`*[_type == "hero"][0]{
        tagline,
        titleLine1,
        titleLine2,
        titleLine3,
        subtitle,
        ctaPrimaryText,
        ctaPrimaryHref,
        ctaSecondaryText,
        ctaSecondaryHref
      }`)
      .then((fetched) => {
        if (isMounted && fetched) {
          setData({
            tagline: fetched.tagline || defaultHeroData.tagline,
            titleLine1: fetched.titleLine1 || defaultHeroData.titleLine1,
            titleLine2: fetched.titleLine2 || defaultHeroData.titleLine2,
            titleLine3: fetched.titleLine3 || defaultHeroData.titleLine3,
            subtitle: fetched.subtitle || defaultHeroData.subtitle,
            ctaPrimaryText:
              fetched.ctaPrimaryText || defaultHeroData.ctaPrimaryText,
            ctaPrimaryHref:
              fetched.ctaPrimaryHref || defaultHeroData.ctaPrimaryHref,
            ctaSecondaryText:
              fetched.ctaSecondaryText || defaultHeroData.ctaSecondaryText,
            ctaSecondaryHref:
              fetched.ctaSecondaryHref || defaultHeroData.ctaSecondaryHref,
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFFDF6]"
    >
      {/* Gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-[#FFFDF6]/80" />

      {/* Subtle grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

      {/* Decorative circles */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.08 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full border border-[#CA5254]"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
        className="absolute -bottom-48 -left-48 h-[800px] w-[800px] rounded-full border border-[#960C3F]"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        className="absolute top-1/4 -left-20 h-[400px] w-[400px] rounded-full bg-[#D9A261]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center mt-20">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 text-sm font-medium uppercase tracking-[0.3em] text-[#D9A261]"
        >
          {data.tagline}
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 font-heading text-5xl font-bold leading-[1.1] tracking-tight text-[#CA5254] md:text-6xl lg:text-8xl"
        >
          {data.titleLine1}
          <br />
          <span className="text-[#960C3F]">{data.titleLine2}</span>
          <br />
          <span className="text-[#960C3F]">{data.titleLine3}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mx-auto mb-14 max-w-xl text-lg leading-relaxed text-[#960C3F]/60 md:text-xl"
        >
          {data.subtitle}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={data.ctaPrimaryHref}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#CA5254] px-10 text-base font-semibold text-[#FFFDF6] shadow-lg shadow-[#CA5254]/20 transition-all hover:bg-[#960C3F] hover:shadow-xl hover:shadow-[#960C3F]/30"
          >
            {data.ctaPrimaryText}
          </Link>
          <button
            onClick={openModal}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#960C3F]/20 px-10 text-base font-medium text-[#960C3F] transition-colors hover:bg-[#960C3F]/5"
          >
            {data.ctaSecondaryText}
          </button>
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
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown className="h-5 w-5 text-[#960C3F]/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
