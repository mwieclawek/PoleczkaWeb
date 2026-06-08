"use client";

import { motion } from "framer-motion";
import { Leaf, Flame, Sun, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const values = [
  {
    icon: Leaf,
    title: "Lokalne składniki",
    description:
      "Współpracujemy z regionalnymi dostawcami i rolnikami — każdy produkt ma swoją historię.",
  },
  {
    icon: Flame,
    title: "Nowoczesne techniki",
    description:
      "Sous-vide, fermentacja, wędzenie — tradycyjne smaki podane w zaskakującej formie.",
  },
  {
    icon: Sun,
    title: "Unikalne patio",
    description:
      "W sezonie zapraszamy na zaciszne patio — jedzenie na świeżym powietrzu w centrum Wrocławia.",
  },
  {
    icon: Heart,
    title: "Pasja i serce",
    description:
      "Każde danie tworzymy z miłości do polskiej kuchni i chęci dzielenia jej z innymi.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#F9F3DB] py-24 md:py-32"
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
              fill="#1028AB"
            />
          ))}
        </svg>
      </div>

      {/* Subtle decorative element */}
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[500px] w-[500px] rounded-full bg-[#D9A261]/[0.05]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-[#D9A261]">
            O nas
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#CA5254] md:text-5xl">
            Więcej niż restauracja
          </h2>
          <Separator className="mx-auto mt-6 w-16 bg-[#D9A261]/40" />
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-12 max-w-3xl text-center"
        >
          <p className="text-lg leading-relaxed text-[#1028AB]/80 md:text-xl">
            Poleczka to nowoczesna kuchnia polska we Wrocławiu. Opieramy się na{" "}
            <strong className="text-[#CA5254] font-semibold">
              tradycyjnych, lokalnych składnikach
            </strong>
            , wydobywając z nich pełnię smaku dzięki nowoczesnym technikom
            kulinarnym. Miejsce stworzone z pasją, gdzie klasyka spotyka się
            z finezją.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-[#1028AB]/80 md:text-xl">
            Na naszym unikalnym{" "}
            <strong className="text-[#CA5254] font-semibold">zacienionym patio</strong>{" "}
            poczujesz atmosferę starego Wrocławia, delektując się smakami nowej
            polskiej kuchni. Świeże zioła prosto z&nbsp;naszego mini-ogródka,
            sery od lokalnych serowarów i sezonowe warzywa od dolnośląskich
            rolników — tak tworzymy nasze menu.
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="group rounded-2xl border border-[#A6A6A6]/20 bg-white/60 p-6 backdrop-blur-sm transition-all hover:border-[#1028AB]/30 hover:shadow-lg hover:shadow-[#1028AB]/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1028AB]/5 transition-colors group-hover:bg-[#1028AB]/10">
                <value.icon className="h-5 w-5 text-[#1028AB]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#CA5254]">
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#A6A6A6]">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
