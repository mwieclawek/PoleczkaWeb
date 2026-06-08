"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface MenuCategory {
  key: string;
  label: string;
  emoji: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    key: "przystawki",
    label: "Przystawki",
    emoji: "🥂",
    items: [
      {
        id: "1",
        name: "Pasztet z karmelizowaną cebulą",
        description:
          "Pasztet domowy z karmelizowaną cebulą, piklami i olejem szczypiorkowym",
        price: 32,
      },
      {
        id: "2",
        name: "Gofry ziemniaczane z wędzonym karpiem",
        description:
          "Chrupiące gofry ziemniaczane z wędzonym karpiem milickim i majonezem koperkowym",
        price: 36,
      },
      {
        id: "3",
        name: "Seler pieczony w soli i kawie",
        description:
          "Seler pieczony w soli i kawie z aromatycznym sosem Café de Paris",
        price: 39,
      },
      {
        id: "4",
        name: "Polska surowa w cydrze",
        description:
          "Klasyczna polska surowa wołowa marynowana w cydrze, podana z chrupiącym pieczywem",
        price: 28,
      },
      {
        id: "5",
        name: "Krem z wędzonego twarogu",
        description:
          "Aksamitny krem z wędzonego twarogu z botwinką z patelni",
        price: 24,
      },
    ],
  },
  {
    key: "zupy",
    label: "Zupy",
    emoji: "🍜",
    items: [
      {
        id: "6",
        name: "Rosół z makaronem",
        description:
          "Klarowny rosół domowy z makaronem z naleśnika razowego",
        price: 24,
      },
      {
        id: "7",
        name: "Botwinka",
        description:
          "Lekka botwinka z zielonymi kluskami lanymi — smak lata w miseczce",
        price: 26,
      },
      {
        id: "8",
        name: "Krem z selera z kawiorem",
        description:
          "Jedwabisty krem z selera zwieńczony kawiorem z pstrąga",
        price: 29,
      },
    ],
  },
  {
    key: "glowne",
    label: "Główne",
    emoji: "🍽️",
    items: [
      {
        id: "9",
        name: "Leniwe z fasolką szparagową",
        description:
          "Leniwe z fasolką szparagową, chrupką ziołową i palonym masłem",
        price: 39,
      },
      {
        id: "10",
        name: "Kluski śląskie w sosie mięsnym",
        description:
          "Kluski śląskie w aromatycznym sosie mięsnym — maczanka z karkówki",
        price: 49,
      },
      {
        id: "11",
        name: "Schabowy",
        description:
          "Klasyczny schabowy panierowany w złocistej bułce z puree ziemniaczanym i mizerią",
        price: 46,
      },
      {
        id: "12",
        name: "Pierś z kaczki sous-vide",
        description:
          "Pierś z kaczki sous-vide z sosem winno-porzeczkowym i puree kalafiorowym",
        price: 68,
      },
      {
        id: "13",
        name: "Mielone z ogórkami gruntowymi",
        description:
          "Soczyste mielone z ogórkami gruntowymi i kremowym puree ziemniaczanym",
        price: 36,
      },
      {
        id: "14",
        name: "Młode ziemniaki z bobem",
        description:
          "Młode ziemniaki z bobem, jajem sadzonym i twarogiem wędzonym",
        price: 36,
      },
    ],
  },
  {
    key: "desery",
    label: "Desery",
    emoji: "🍰",
    items: [
      {
        id: "15",
        name: "Leniwe na słodko",
        description:
          "Leniwe z palonym masłem, sosem jeżynowym i kwaśną śmietaną",
        price: 26,
      },
      {
        id: "16",
        name: "Sezonowe owoce z kruszonką",
        description:
          "Sezonowe owoce z chrupiącą kruszonką i kremem chantilly z prawdziwą wanilią",
        price: 29,
      },
    ],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function MenuSection() {
  return (
    <section id="menu" className="relative bg-[#F9F3DB] py-24 md:py-32">
      {/* Subtle decorative element */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-[300px] w-[300px] rounded-full bg-[#D9A261]/[0.05]" />

      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-[#D9A261]">
            Menu
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#CA5254] md:text-5xl">
            Nasze menu
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#A6A6A6]">
            Polskie klasyki w nowoczesnym wydaniu. Wszystkie dania przygotowane
            ze świeżych, lokalnych składników od dolnośląskich dostawców.
          </p>
          <Separator className="mx-auto mt-8 w-16 bg-[#D9A261]/40" />
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="przystawki" className="mt-14">
          <TabsList className="mx-auto grid w-full max-w-lg grid-cols-4 bg-[#A6A6A6]/10">
            {menuCategories.map((cat) => (
              <TabsTrigger
                key={cat.key}
                value={cat.key}
                className="text-sm text-[#1028AB] data-[state=active]:bg-[#CA5254] data-[state=active]:text-[#F9F3DB] data-active:bg-[#CA5254] data-active:text-[#F9F3DB] transition-all"
              >
                <span className="mr-1 hidden sm:inline">{cat.emoji}</span>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {menuCategories.map((cat) => (
            <TabsContent key={cat.key} value={cat.key} className="mt-10">
              <div className="divide-y divide-[#A6A6A6]/20">
                {cat.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="group flex items-start justify-between gap-4 rounded-lg px-4 py-6 -mx-4 transition-colors hover:bg-white/60"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-[#1028AB]">
                          {item.name}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#A6A6A6]">
                        {item.description}
                      </p>
                    </div>
                    {/* Decorative dotted line */}
                    <div className="mt-3 hidden flex-1 border-b border-dotted border-[#A6A6A6]/30 sm:block" />
                    <span className="shrink-0 pt-0.5 text-lg font-bold text-[#CA5254]">
                      {item.price}&nbsp;zł
                    </span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
