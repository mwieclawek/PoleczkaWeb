"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

/* ── Types ────────────────────────────────────────────────────── */

interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  highlighted?: boolean;
}

interface MenuCategory {
  key: string;
  label: string;
  items: MenuItemData[];
}

/* ── Reusable MenuItem component ──────────────────────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

function MenuItem({
  item,
  index,
}: {
  item: MenuItemData;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`flex items-baseline justify-between gap-4 py-7 ${
        item.highlighted
          ? "relative pl-5 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[2px] before:rounded-full before:bg-[#CA5254]"
          : ""
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-[#960C3F]">
            {item.name}
          </h3>
          {item.highlighted && (
            <span className="inline-block rounded-full bg-[#D9A261]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#CA5254]">
              Klasyk Poleczki
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed tracking-wide text-[#A6A6A6]">
          {item.description}
        </p>
      </div>
      <span className="shrink-0 text-lg font-bold tabular-nums text-[#CA5254]">
        {item.price}&nbsp;zł
      </span>
    </motion.div>
  );
}

/* ── Menu data ────────────────────────────────────────────────── */

const menuCategories: MenuCategory[] = [
  {
    key: "przystawki",
    label: "Przystawki",
    items: [
      {
        id: "1",
        name: "Seler pieczony w soli i kawie",
        description:
          "Stek z korzenia selera pieczony przez trzy godziny w masie solnej | gorący sos Café de Paris z anchois i kaparami",
        price: 39,
      },
      {
        id: "2",
        name: "Polska surowa w cydrze",
        description:
          "Śląska kiełbasa duszona w rzemieślniczym cydrze ze Wzgórz Trzebnickich | świeże pieczywo | rzemieślnicze masło",
        price: 28,
      },
      {
        id: "3",
        name: "Krem z wędzonego twarogu",
        description:
          "Twaróg wędzony emulsyfikowany ze śmietanką | smażona botwinka i buraczki | szalotka | kapary | palone masło | pieczywo",
        price: 24,
      },
      {
        id: "4",
        name: "Gofry ziemniaczane",
        description:
          "Chrupiące gofry z tartych ziemniaków | wędzony karp z Doliny Baryczy (milicki) | autorski majonez koperkowy | olej grzybowy",
        price: 36,
        highlighted: true,
      },
      {
        id: "5",
        name: "Pasztet z karmelizowaną cebulą",
        description:
          "Domowy pasztet z wieprzowiny, wołowiny z rosołu i wątróbki | cebula wolno duszona z octem winnym i miodem | pikle | olej szczypiorkowy | pieczywo",
        price: 32,
        highlighted: true,
      },
    ],
  },
  {
    key: "zupy",
    label: "Zupy",
    items: [
      {
        id: "6",
        name: "Domowy rosół",
        description:
          "Esencjonalny bulion na korpusach z kaczki, szpondrze wołowym i palonych warzywach | makaron z naleśnika z mąki graham | olej szczypiorkowy",
        price: 24,
      },
      {
        id: "7",
        name: "Botwinka",
        description:
          "Tradycyjna letnia zupa na wywarze warzywnym | zielone kluski lane ze szpinakiem | koperek | kwaśna śmietana",
        price: 26,
      },
      {
        id: "8",
        name: "Krem z selera",
        description:
          "Aksamitna zupa z pieczonego selera i ziemniaków | kawior z pstrąga | mikroliście rzodkiewki",
        price: 29,
        highlighted: true,
      },
    ],
  },
  {
    key: "glowne",
    label: "Dania główne",
    items: [
      {
        id: "9",
        name: "Pierś z kaczki",
        description:
          "Kaczka przygotowywana techniką sous-vide, obsmażana na chrupiąco | sos winno-porzeczkowy z jeżynami | gładkie puree z kalafiora",
        price: 68,
      },
      {
        id: "10",
        name: "Kluski z maczanką",
        description:
          "Ręcznie formowane kluski śląskie z mączystych ziemniaków | rwana karkówka duszona w winie i bulionie (maczanka) | karmelizowana cebula",
        price: 49,
        highlighted: true,
      },
      {
        id: "11",
        name: "Kluski z porem",
        description:
          "Ręcznie formowane kluski śląskie z mączystych ziemniaków | pieczony por duszony w śmietance",
        price: 38,
      },
      {
        id: "12",
        name: "Klasyczny schabowy",
        description:
          "Złocisty kotlet schabowy smażony na smalcu z panko | jedwabiste puree ziemniaczane na mleku i maśle | mizeria z ogórków gruntowych",
        price: 46,
      },
      {
        id: "13",
        name: "Wątróbka drobiowa",
        description:
          "Krótko smażona wątróbka oprószona mąką | duszona cebula i polskie jabłko (Szara Reneta) | jedwabiste puree ziemniaczane",
        price: 29,
        highlighted: true,
      },
      {
        id: "14",
        name: "Młode ziemniaki",
        description:
          "Ziemniaki z wody w mundurkach | bób z patelni na szalotce i maśle | jajo sadzone | kruszony twaróg wędzony | świeże zioła",
        price: 36,
      },
      {
        id: "15",
        name: "Leniwe",
        description:
          "Domowe kluski z twarogu półtłustego | letnia fasolka szparagowa | chrupka ziołowa z czerstwego chleba | złote palone masło",
        price: 39,
      },
    ],
  },
  {
    key: "desery",
    label: "Desery",
    items: [
      {
        id: "16",
        name: "Sezonowe owoce pod kruszonką",
        description:
          "Gorące owoce jagodowe | maślana kruszonka | domowy krem chantilly z prawdziwą wanilią",
        price: 29,
      },
      {
        id: "17",
        name: "Leniwe na słodko",
        description:
          "Klasyczne kluski twarogowe | palone masło ze złotą bułką tartą | redukowany sos jeżynowy | kwaśna śmietana",
        price: 26,
      },
    ],
  },
  {
    key: "dzieci",
    label: "Dla dzieci",
    items: [
      {
        id: "18",
        name: "Zupa pomidorowa",
        description: "Klasyka domowego obiadu | drobny makaron",
        price: 16,
      },
      {
        id: "19",
        name: "Mały rosół z kluseczkami",
        description: "Klarowny bulion | drobne kluseczki lane",
        price: 16,
      },
      {
        id: "20",
        name: "Mini schabowy z puree",
        description:
          "Mniejsza porcja naszego schabowego | jedwabiste puree ziemniaczane",
        price: 24,
      },
      {
        id: "21",
        name: "Leniwe na słodko z masłem i cukrem",
        description: "Domowe kluski twarogowe | rozpuszczone masło | cukier puder",
        price: 19,
      },
    ],
  },
];

/* ── MenuSection component ────────────────────────────────────── */

export default function MenuSection() {
  return (
    <section id="menu" className="relative bg-[#FFFDF6] py-28 md:py-40">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-[#D9A261]">
            Sezon: Lato 2026
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#CA5254] md:text-5xl">
            Menu Letnie
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#960C3F]/60">
            Korzystamy z pełni polskiego lata. W&nbsp;tej karcie znajdziecie
            botwinkę, młody bób, fasolkę szparagową i&nbsp;owoce jagodowe
            z&nbsp;lokalnych zbiorów. Pracujemy z&nbsp;naturą, dlatego nasze
            menu zmienia się wraz z&nbsp;porami roku.
          </p>
          <Separator className="mx-auto mt-8 w-16 bg-[#D9A261]/40" />
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="przystawki" className="mt-16">
          <TabsList className="mx-auto grid w-full max-w-xl grid-cols-5 bg-[#A6A6A6]/10">
            {menuCategories.map((cat) => (
              <TabsTrigger
                key={cat.key}
                value={cat.key}
                className="text-xs sm:text-sm text-[#960C3F] data-[state=active]:bg-[#CA5254] data-[state=active]:text-[#FFFDF6] data-active:bg-[#CA5254] data-active:text-[#FFFDF6] transition-all"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {menuCategories.map((cat) => (
            <TabsContent key={cat.key} value={cat.key} className="mt-12">
              <div className="divide-y divide-[#A6A6A6]/15">
                {cat.items.map((item, i) => (
                  <MenuItem key={item.id} item={item} index={i} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Seasonal teaser */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center text-sm leading-relaxed text-[#A6A6A6]"
        >
          Z każdym chłodniejszym dniem przygotowujemy się do nowych zbiorów.
          <br className="hidden sm:block" />
          Menu jesienne już wkrótce.
        </motion.p>
      </div>
    </section>
  );
}
