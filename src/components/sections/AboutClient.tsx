"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/client";

export interface PrincipleItem {
  title: string;
  text: string;
}

export interface AboutData {
  subtitle?: string;
  heading?: string;
  grandOpeningDate?: string;
  history?: string[];
  principles?: PrincipleItem[];
}

export const defaultAboutData: Required<AboutData> = {
  subtitle: "O nas",
  heading: "Szacunek do produktu",
  grandOpeningDate: "Lipiec 2026",
  history: [
    "Poleczka to miejsce stworzone z pasji do prawdziwego jedzenia. Nie idziemy na skróty. Wierzymy, że to, co najlepsze w polskiej kuchni, leży w naturze i rzemiośle.",
    "Nasz seler pieczemy przez długie godziny w masie solnej i kawie, by wydobyć z niego głębię smaku umami. Własnoręcznie zagniatamy ciasto na kluski śląskie i leniwe, a nasze sosy opierają się na głębokich, redukowanych bulionach i palonym maśle.",
    "W sercu wrocławskiego Śródmieścia, przy ulicy Jaracza, stworzyliśmy przestrzeń bez zadęcia. Z intymnym patio, na którym czas płynie wolniej. To nie jest po prostu restauracja. To nasza wizja polskiej gościnności — gdzie każdy talerz to efekt precyzji, wiedzy i szacunku do lokalnego produktu.",
  ],
  principles: [
    {
      title: "Lokalne składniki",
      text: "Współpracujemy z dolnośląskimi rolnikami i dostawcami. Karp milicki, sery od lokalnych serowarów, sezonowe warzywa — każdy produkt ma swoją historię.",
    },
    {
      title: "Rzemieślnicze techniki",
      text: "Sous-vide, pieczenie w masie solnej, fermentacja, palenie masła. Tradycyjne smaki podane w bezkompromisowej, nowoczesnej formie.",
    },
    {
      title: "Patio na Jaracza",
      text: "W sezonie zapraszamy na zaciszne patio — kameralna przestrzeń w centrum Wrocławia, gdzie jedzenie na świeżym powietrzu nabiera innego wymiaru.",
    },
    {
      title: "Bez zadęcia",
      text: "Gotujemy z precyzją i wiedzą, ale serwujemy bez pretensji. Chcemy, żebyś czuł się jak u siebie — tyle że jedzenie jest lepsze.",
    },
  ],
};

export default function AboutClient({
  initialData,
}: {
  initialData: AboutData | null;
}) {
  const [data, setData] = useState<Required<AboutData>>({
    subtitle: initialData?.subtitle || defaultAboutData.subtitle,
    heading: initialData?.heading || defaultAboutData.heading,
    grandOpeningDate:
      initialData?.grandOpeningDate || defaultAboutData.grandOpeningDate,
    history:
      initialData?.history && initialData.history.length > 0
        ? initialData.history
        : defaultAboutData.history,
    principles:
      initialData?.principles && initialData.principles.length > 0
        ? initialData.principles
        : defaultAboutData.principles,
  });

  // Client-side fetch to ensure fresh preview updates from Sanity Studio when active
  useEffect(() => {
    let isMounted = true;
    client
      .fetch<AboutData | null>(`*[_type == "about"][0]{
        subtitle,
        heading,
        grandOpeningDate,
        history,
        principles
      }`)
      .then((fetched) => {
        if (isMounted && fetched) {
          setData({
            subtitle: fetched.subtitle || defaultAboutData.subtitle,
            heading: fetched.heading || defaultAboutData.heading,
            grandOpeningDate:
              fetched.grandOpeningDate || defaultAboutData.grandOpeningDate,
            history:
              fetched.history && fetched.history.length > 0
                ? fetched.history
                : defaultAboutData.history,
            principles:
              fetched.principles && fetched.principles.length > 0
                ? fetched.principles
                : defaultAboutData.principles,
          });
        }
      })
      .catch(() => {
        // Fallback or ignore
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#FFFDF6] py-28 md:py-40"
    >
      {/* Decorative dot pattern */}
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 opacity-[0.04]">
        <svg width="256" height="256" fill="none">
          {Array.from({ length: 64 }).map((_, i) => (
            <circle
              key={i}
              cx={(i % 8) * 32 + 16}
              cy={Math.floor(i / 8) * 32 + 16}
              r="2"
              fill="#960C3F"
            />
          ))}
        </svg>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-[#D9A261]">
            {data.subtitle}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#CA5254] md:text-5xl">
            {data.heading}
          </h2>
          <Separator className="mx-auto mt-6 w-16 bg-[#D9A261]/40" />

          {data.grandOpeningDate && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D9A261]/30 bg-[#D9A261]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#960C3F] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#CA5254] animate-pulse" />
              Data wielkiego otwarcia: {data.grandOpeningDate}
            </div>
          )}
        </motion.div>

        {/* Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 space-y-8"
        >
          {data.history.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg leading-relaxed text-[#960C3F]/80 md:text-xl"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid gap-px bg-[#A6A6A6]/15 sm:grid-cols-2"
        >
          {data.principles.map((item) => (
            <div
              key={item.title}
              className="bg-[#FFFDF6] p-8 transition-colors hover:bg-white/50"
            >
              <h3 className="mb-3 font-heading text-lg font-bold text-[#CA5254]">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#A6A6A6]">
                {item.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
