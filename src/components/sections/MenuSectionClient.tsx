"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/client";

export interface MenuItemData {
  id?: string;
  name: string;
  description: string;
  price: number;
  highlighted?: boolean;
}

export interface MenuCategory {
  key: string;
  label: string;
  items: MenuItemData[];
}

export interface MenuSectionData {
  seasonTag?: string;
  title?: string;
  description?: string;
  categories?: MenuCategory[];
  footerNote?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
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
          <h3 className="font-heading text-xl font-bold text-[#960C3F]">
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

export const defaultMenuSectionData: Required<MenuSectionData> = {
  seasonTag: "Sezon: Lato 2026",
  title: "Menu Letnie",
  description:
    "Korzystamy z pełni polskiego lata. W tej karcie znajdziecie botwinkę, młody bób, fasolkę szparagową i owoce jagodowe z lokalnych zbiorów. Pracujemy z naturą, dlatego nasze menu zmienia się wraz z porami roku.",
  footerNote:
    "Z każdym chłodniejszym dniem przygotowujemy się do nowych zbiorów. Menu jesienne już wkrótce.",
  categories: [
    {
      key: "przystawki",
      label: "Przystawki",
      items: [
        {
          id: "1",
          name: "Seler pieczony w soli i kawie / Café de Paris",
          description:
            "Stek z korzenia selera pieczony przez długie godziny w masie solnej i kawie | gorący sos Café de Paris z anchois i kaparami",
          price: 39,
          highlighted: true,
        },
        {
          id: "2",
          name: "Kiełbasa śląska duszona w cydrze",
          description:
            "Rzemieślnicza kiełbasa duszona w cydrze ze Wzgórz Trzebnickich | świeże pieczywo | aromatyczny sos z redukcji",
          price: 28,
        },
        {
          id: "3",
          name: "Krem z wędzonego twarogu z botwinką",
          description:
            "Aksamitny krem z twarogu wędzonego | smażona botwinka i buraczki z patelni | świeże zioła | rzemieślnicze pieczywo",
          price: 26,
        },
        {
          id: "4",
          name: "Gofr ziemniaczany z wędzonym karpiem",
          description:
            "Chrupiący gofr z tartych ziemniaków | wędzony karp milicki z Doliny Baryczy | autorski majonez koperkowy i grzybowy",
          price: 36,
          highlighted: true,
        },
        {
          id: "5",
          name: "Pasztet z karmelizowaną cebulą",
          description:
            "Domowy pasztet mięsny | słodko-kwaśna karmelizowana cebula | chrupiące pikle | olej szczypiorkowy | świeże pieczywo",
          price: 32,
        },
        {
          id: "6",
          name: "Smalec i masło ziołowe z pieczywem",
          description:
            "Domowy smalec ze skwarkami | krem z wędzonego twarogu | rzemieślnicze masło z solą morską i ziołami | świeże pieczywo",
          price: 24,
        },
      ],
    },
    {
      key: "zupy",
      label: "Zupy",
      items: [
        {
          id: "7",
          name: "Domowy rosół na kaczce",
          description:
            "Esencjonalny bulion na korpusach z kaczki i palonych warzywach | makaron z naleśnika razowego (graham) | świeży olej szczypiorkowy",
          price: 24,
        },
        {
          id: "8",
          name: "Letnia botwinka z zielonymi kluskami",
          description:
            "Tradycyjna letnia zupa z młodych buraków | zielone kluski lane ze szpinakiem | koperek | kwaśna śmietana",
          price: 26,
        },
        {
          id: "9",
          name: "Krem z pieczonego selera",
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
          id: "10",
          name: "Pierś z kaczki z sosem porzeczkowym",
          description:
            "Kaczka sous-vide obsmażana na chrupiąco | sos winno-porzeczkowy z jeżynami | jedwabiste puree z kalafiora | piklowana cebulka",
          price: 68,
          highlighted: true,
        },
        {
          id: "11",
          name: "Kluski śląskie z polikami wieprzowymi",
          description:
            "Ręcznie formowane kluski śląskie z mączystych ziemniaków | rwane poliki wieprzowe w ciemnym, esencjonalnym sosie | chrupiące pikle",
          price: 49,
          highlighted: true,
        },
        {
          id: "12",
          name: "Kluski śląskie z sosem grzybowym",
          description:
            "Ręcznie formowane kluski śląskie | głęboki sos leśny z podgrzybków | chrupka ziołowa z czerstwego chleba lub marynowany akcent",
          price: 44,
        },
        {
          id: "13",
          name: "Klasyczny schabowy na smalcu",
          description:
            "Złocisty kotlet schabowy smażony na smalcu z panko | jedwabiste maślane puree ziemniaczane | mizeria z ogórków gruntowych",
          price: 46,
        },
        {
          id: "14",
          name: "Leniwe z fasolką szparagową",
          description:
            "Domowe kluski z twarogu półtłustego | letnia fasolka szparagowa | chrupka ziołowa | złote palone masło",
          price: 39,
        },
        {
          id: "15",
          name: "Młode ziemniaki z bobem i jajem",
          description:
            "Ziemniaki z wody w mundurkach | bób podsmażany na maśle i szalotce | jajo sadzone | kruszony wędzony twaróg | świeże zioła",
          price: 36,
        },
        {
          id: "16",
          name: "Ziemniaki w mundurkach z puree i kaszą",
          description:
            "Wegetariańska kompozycja: młode ziemniaki w mundurkach | jedwabiste puree ziemniaczane | kasza gryczana | surówki i domowe kiszonki",
          price: 36,
        },
      ],
    },
    {
      key: "desery",
      label: "Desery",
      items: [
        {
          id: "17",
          name: "Sezonowe owoce pod maślaną kruszonką",
          description:
            "Gorące owoce jagodowe prosto z sadu | chrupiąca maślana kruszonka | domowa puszysta bita śmietana z prawdziwą wanilią",
          price: 29,
        },
        {
          id: "18",
          name: "Leniwe na słodko z palonym masłem",
          description:
            "Klasyczne kluski twarogowe | palone masło ze złotą bułką tartą | redukowany sos jeżynowy | kwaśna śmietana",
          price: 26,
        },
      ],
    },
    {
      key: "napoje",
      label: "Napoje & Spritz",
      items: [
        {
          id: "19",
          name: "Porzeczka Hugo Spritz",
          description:
            "Autorski spritz na bazie prosecco, syropu z czarnej porzeczki, mięty i limonki",
          price: 32,
          highlighted: true,
        },
        {
          id: "20",
          name: "Lawenda & Ogórek Spritz",
          description:
            "Odświeżające koktajle spritz do wyboru: aromatyczny Lawenda Spritz lub wytrawny Spritz Ogórkowy",
          price: 32,
        },
        {
          id: "21",
          name: "Wyselekcjonowane wina & Piwa rzemieślnicze",
          description:
            "Piwo lane i butelkowe z lokalnych browarów | Wina białe (Chardonnay, Vinho Verde) i czerwone (Cabernet, Musaco)",
          price: 22,
        },
        {
          id: "22",
          name: "Lemoniady rzemieślnicze & Napoje",
          description:
            "Soki sezonowe (zapytaj obsługę) | Lipton | Mio Mio | Woda gazowana lub niegazowana",
          price: 16,
        },
        {
          id: "23",
          name: "Kawa z lokalnej palarni & Herbata liściasta",
          description:
            "Kawa (Czarna / Biała / Espresso / Cappuccino) | Herbata (Czarna / Zielona / Owocowa / Ziołowa w czajniczku)",
          price: 14,
        },
      ],
    },
    {
      key: "dzieci",
      label: "Dla dzieci",
      items: [
        {
          id: "24",
          name: "Zupa pomidorowa",
          description: "Klasyka domowego obiadu | drobny makaron",
          price: 16,
        },
        {
          id: "25",
          name: "Mały rosół z kluseczkami",
          description: "Klarowny bulion | drobne kluseczki lane",
          price: 16,
        },
        {
          id: "26",
          name: "Mini schabowy z puree",
          description:
            "Mniejsza porcja naszego schabowego | jedwabiste puree ziemniaczane",
          price: 24,
        },
        {
          id: "27",
          name: "Leniwe na słodko z masłem i cukrem",
          description: "Domowe kluski twarogowe | rozpuszczone masło | cukier puder",
          price: 19,
        },
      ],
    },
  ],
};

export default function MenuSectionClient({
  initialData,
}: {
  initialData: MenuSectionData | null;
}) {
  const [data, setData] = useState<Required<MenuSectionData>>({
    seasonTag: initialData?.seasonTag || defaultMenuSectionData.seasonTag,
    title: initialData?.title || defaultMenuSectionData.title,
    description: initialData?.description || defaultMenuSectionData.description,
    footerNote: initialData?.footerNote || defaultMenuSectionData.footerNote,
    categories:
      initialData?.categories && initialData.categories.length > 0
        ? initialData.categories
        : defaultMenuSectionData.categories,
  });

  useEffect(() => {
    let isMounted = true;
    client
      .fetch<MenuSectionData | null>(`*[_type == "menuSection"][0]{
        seasonTag,
        title,
        description,
        footerNote,
        categories[]{
          key,
          label,
          items[]{
            name,
            description,
            price,
            highlighted
          }
        }
      }`)
      .then((fetched) => {
        if (isMounted && fetched) {
          setData({
            seasonTag: fetched.seasonTag || defaultMenuSectionData.seasonTag,
            title: fetched.title || defaultMenuSectionData.title,
            description:
              fetched.description || defaultMenuSectionData.description,
            footerNote: fetched.footerNote || defaultMenuSectionData.footerNote,
            categories:
              fetched.categories && fetched.categories.length > 0
                ? fetched.categories
                : defaultMenuSectionData.categories,
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategories =
    data.categories && data.categories.length > 0
      ? data.categories
      : defaultMenuSectionData.categories;

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
            {data.seasonTag}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#960C3F] md:text-5xl">
            {data.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#960C3F]/60">
            {data.description}
          </p>
          <Separator className="mx-auto mt-8 w-16 bg-[#D9A261]/40" />
        </motion.div>

        {/* Tabs */}
        {activeCategories && activeCategories.length > 0 && (
          <Tabs defaultValue={activeCategories[0].key || "przystawki"} className="mt-16">
            <TabsList className="mx-auto flex flex-wrap justify-center gap-1.5 p-1.5 w-full max-w-2xl h-auto bg-[#A6A6A6]/10 rounded-2xl">
              {activeCategories.map((cat) => (
                <TabsTrigger
                  key={cat.key || cat.label}
                  value={cat.key || "przystawki"}
                  className="text-xs sm:text-sm text-[#960C3F] data-[state=active]:bg-[#CA5254] data-[state=active]:text-[#FFFDF6] data-active:bg-[#CA5254] data-active:text-[#FFFDF6] transition-all px-4 py-2 rounded-xl"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeCategories.map((cat) => (
              <TabsContent
                key={cat.key || cat.label}
                value={cat.key || "przystawki"}
                className="mt-12"
              >
                <div className="divide-y divide-[#A6A6A6]/15">
                  {cat.items?.map((item, i) => (
                    <MenuItem
                      key={item.name + i}
                      item={{ ...item, id: String(i) }}
                      index={i}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Seasonal teaser */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center text-sm leading-relaxed text-[#A6A6A6]"
        >
          {data.footerNote}
        </motion.p>
      </div>
    </section>
  );
}
