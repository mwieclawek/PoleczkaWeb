"use client";

import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export interface PrincipleItem {
  title: string;
  text?: string;
}

export interface AboutData {
  subtitle?: string;
  heading?: string;
  history?: string[];
  principles?: PrincipleItem[];
}

export const defaultAboutData: Required<AboutData> = {
  subtitle: "Kim jesteśmy",
  heading: "O nas",
  history: [
    "Bistro Poleczka to miejsce, które powstało z miłości do jedzenia i chęci dzielenia się nim z innymi. Tworzone przez trójkę przyjaciół, jest realizacją naszego wieloletniego marzenia o własnym miejscu, w którym będziemy mogli Was gościć. ",
    "Sercem Bistro Poleczka jest autorskie ujęcie tradycyjnej kuchni polskiej, bazujące na lokalnych i sezonowych produktach. Zamiast sztywnych ram czy nowoczesnych haseł typu fusion, serwujemy własne spojrzenie na wyjątkowe kompozycje smakowe oraz świeże odsłony polskich klasyków. ",
    "W środku czeka na Was luźna i niezwykle przyjazna atmosfera – dbamy o to, aby każdy z naszych gości czuł się u nas w pełni komfortowo i jak u siebie. Zapraszamy! ",
  ],
  principles: [
    {
      title: "Bistro Poleczka to nasze spełnione marzenie",
      text: "Jesteśmy trójką przyjaciół, którzy po prostu kochają dobrze zjeść i chcą się tą miłością z Wami dzielić.",
    },
    {
      title: "Bez zadęcia",
      text: "Bez sztywnych reguł i bez udawania, że to skomplikowane „fusion”.",
    },
    {
      title: "Gotujemy z tego, co lokalne i sezonowe",
      text: "Odświeżając polskie klasyki tak, jak lubimy najbardziej – z pomysłem i od serca.",
    },
    {
      title: "Rozgośćcie się!",
    },
  ],
};

export default function AboutClient({
  initialData,
}: {
  initialData: AboutData | null;
}) {
  const data: Required<AboutData> = {
    subtitle: initialData?.subtitle || defaultAboutData.subtitle,
    heading: initialData?.heading || defaultAboutData.heading,
    history:
      initialData?.history && initialData.history.length > 0
        ? initialData.history
        : defaultAboutData.history,
    principles:
      initialData?.principles && initialData.principles.length > 0
        ? initialData.principles
        : defaultAboutData.principles,
  };

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

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start">
          {/* Section header */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left lg:col-span-4 lg:sticky lg:top-32"
          >
            <span className="text-sm font-medium uppercase tracking-widest text-[#D9A261]">
              {data.subtitle}
            </span>
            <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#CA5254] md:text-5xl lg:text-6xl">
              {data.heading}
            </h2>
            <Separator className="mx-auto lg:mx-0 mt-6 w-16 bg-[#D9A261]/40" />
          </motion.div>

          {/* Right column content */}
          <div className="lg:col-span-8 mt-16 lg:mt-0">
            {/* Narrative */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
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
              initial={false}
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
                  {item.text && (
                    <p className="text-sm leading-relaxed text-[#A6A6A6]">
                      {item.text}
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
