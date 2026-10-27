"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { trackEvent } from "@/lib/analytics";

export interface MenuItemData {
  id?: string;
  name: string;
  description: string;
  price?: number;
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
      initial={false}
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
          <h4 className="font-heading text-xl font-bold text-[#960C3F]">
            {item.name}
          </h4>
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
      {item.price != null && (
        <span className="shrink-0 text-lg font-bold tabular-nums text-[#CA5254]">
          {item.price}&nbsp;zł
        </span>
      )}
    </motion.div>
  );
}

export const defaultMenuSectionData: Required<MenuSectionData> = {
  seasonTag: "Sezon: Jesień 2026",
  title: "Menu Jesienne",
  description: "   ",
  footerNote:
    "Z każdym chłodniejszym dniem przygotowujemy się do menu zimowego.",
  categories: [
    {
      key: "przystawki",
      label: "Dania mniejsze",
      items: [
        {
          id: "624faafe3995bfaaf24941f98b132c2d",
          name: "Trio degustacyjne Poleczki",
          description: "PYRA Z GZIKIEM / KASZANKA NA CHAŁCE / TATAR",
          price: 90,
          highlighted: true,
        },
        {
          id: "9da56313ac23a67caf58931070a38bc5",
          name: "Trio Pajd",
          description:
            "PÓŁ PAJDY ZE SMALCEM / PÓŁ PAJDY Z PASZTETEM / PÓŁ PAJDY Z WEGE SMALCEM",
          price: 33,
          highlighted: true,
        },
        {
          id: "118a975bc390b9d0044db6901663a898",
          name: "Pyra z gzikiem, z borowikiem",
          description:
            "ZIEMNIAK W MUNDURKU / GZIK / BOROWIK Z CEBULKĄ SMAŻONY NA MAŚLE / OLEJ SZCZYPIORKOWY",
          price: 27,
          highlighted: false,
        },
        {
          id: "19d211ce71e3",
          name: "Kaszanka na chałce",
          description:
            "KASZANKA SMAŻONA Z CEBULĄ / GRILOWANA CHAŁKA / SALSA Z ZIELONEGO JABŁKA / BOCZEK",
          price: 32,
          highlighted: false,
        },
        {
          id: "d7ccdf0b7b05",
          name: "Tatar z antrykotu",
          description:
            "SIEKANY ANTRYKOT WOŁOWY / SZALOTKA / KAPARY / MUSZTARDA DIJON / GRZYB SHIMEJI / MAJONEZ PIETRUSZKOWY / PIECZYWO",
          price: 52,
          highlighted: false,
        },
        {
          id: "5e318c1be11adaf40f02ff921ba2629d",
          name: "Pajda z pasztetem",
          description:
            "DOMOWY PASZTET / KARMELIZOWANA CEBULA / JEŻYNA / OLEJ KOPERKOWY / PIECZYWO",
          price: 25,
          highlighted: true,
        },
        {
          id: "14af2e9f41afd5f0c2765d239af56d6c",
          name: "Pajda ze smalcem lub wege smalcem",
          description:
            "DOMOWY SMALEC ZE SKWARKAMI I JABŁKIEM / KARMELIZOWANA CEBULA / OGÓREK KISZONY / PIECZYWO",
          price: 18,
          highlighted: false,
        },
      ],
    },
    {
      key: "zupy",
      label: "Zupy",
      items: [
        {
          id: "c32b2dba6507b98fc7cc4357d388cb95",
          name: "Rosół z trzech mięs",
          description:
            "BULION Z WOŁOWINY, KURY I KACZKI / MAKARON Z NALEŚNIKA RAZOWEGO / OLEJ SZCZYPIORKOWY / PIETRUSZKA",
          price: 25,
          highlighted: false,
        },
        {
          id: "6344eb5cf9f10034d56af8e41699b566",
          name: "Grzybowa",
          description:
            "ZUPA GRZYBOWA NA BULIONIE Z TRZECH MIĘS / KWAŚNA ŚMIETANA / KOPER",
          price: 28,
          highlighted: false,
        },
        {
          id: "2aa6c789cf6a",
          name: "Zupa dnia",
          description: "ZAPYTAJ OBSŁUGĘ - ZAWSZE WEGE",
          price: 22,
          highlighted: false,
        },
      ],
    },
    {
      key: "glowne",
      label: "Dania główne",
      items: [
        {
          id: "750657e927c750ada791d8f7d6683d4f",
          name: "Kremowe kaszotto grzybowe",
          description:
            "KASZA GRYCZANA / GRZYBY LEŚNE / ŚMIETANKA / DYNIA / SER KOZI",
          price: 39,
          highlighted: false,
        },
        {
          id: "2c82aa858672c7310078f6306f3f8e8a",
          name: "Kotlet schabowy",
          description:
            "SCHAB MARYNOWANY W MLEKU I CEBULI / ZIEMNIACZANE PUREE Z CHRZANEM / KARMELIZOWANA CEBULA",
          price: 39,
          highlighted: true,
        },
        {
          id: "c65a658dc5d3e38e5fa2460bb2aae59f",
          name: "Korzenne policzki wołowe",
          description:
            "POLICZKI WOŁOWE W PRZYPRAWACH KORZENNYCH / PUREE ZIEMNIACZANE / WARZYWA KORZENNE / DEMI GLACE",
          price: 72,
          highlighted: true,
        },
        {
          id: "efb82f79238c69b898be88f09591a5ba",
          name: "Kluski śląskie z polędwiczką",
          description:
            "KLUSKI ŚLĄSKIE / POLĘDWICZKA WIEPRZOWA / SOS CHRZANOWY / ŻURAWINA / SZCZYPIOR",
          price: 39,
          highlighted: false,
        },
        {
          id: "4d18140241f1aca4873e87b69a1b08b6",
          name: "Gołąbki z mięsem, pęczakiem i grzybami",
          description:
            "KAPUSTA WŁOSKA / KASZA JĘCZMIENNA / KARKÓWKA WIEPRZOWA / GRZYBY LEŚNE - DOSTĘPNE RÓWNIEŻ WEGE",
          price: 46,
          highlighted: false,
        },
        {
          id: "56453407fef39df80dc6894a1874faca",
          name: "Sałatka z pieczonymi warzywami",
          description:
            "SOS Z PIECZONEJ PAPRYKI / MIESZANKA SAŁATY RZYMSKIEJ I CYKORII / GRILOWANE WARZYWA / SER KOZI",
          price: 38,
          highlighted: false,
        },
      ],
    },
    {
      key: "desery",
      label: "Desery",
      items: [
        {
          id: "4dcda354da73776f07c7187cd87f5497",
          name: "Rustykalne kluski dyniowe z serem",
          description:
            "KLUSKI DYNIOWE Z TWAROGIEM PODSMAŻANE NA MAŚLE / KREM CYTRYNOWY / JOGURT / KRUSZONA BEZA",
          price: 30,
          highlighted: false,
        },
        {
          id: "994644852d5b95f8dd423866ebc77e61",
          name: "Tost francuski",
          description:
            "CHAŁKA W JAJKU I MLEKU SMAŻONA NA MAŚLE / LODY WANILIOWE / MALINY W CUKRZE",
          price: 33,
          highlighted: false,
        },
      ],
    },
    {
      key: "dzieci",
      label: "Dla dzieci",
      items: [
        {
          id: "57c65cf744129320512c344e195e8aba",
          name: "Rosołek",
          description: "ROSÓŁ / MAKARON ZWIERZĄTKA",
          highlighted: false,
        },
        {
          id: "9ae2b75de3872d9923b589325dd3d350",
          name: "Zupa pomidorowa",
          description: "ZUPA POMIDOROWA / MAKARON ZWIERZĄTKA",
          highlighted: false,
        },
        {
          id: "d76469748034fd81832cf4fb6a5eb044",
          name: "Nuggetsy z frytkami",
          description: "DOMOWE NUGGETSY / DOMOWE FRYTKI / KETCHUP",
          highlighted: false,
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
  const data: Required<MenuSectionData> = {
    seasonTag: initialData?.seasonTag ?? defaultMenuSectionData.seasonTag,
    title: initialData?.title ?? defaultMenuSectionData.title,
    description: initialData?.description ?? defaultMenuSectionData.description,
    footerNote: initialData?.footerNote ?? defaultMenuSectionData.footerNote,
    categories:
      initialData?.categories && initialData.categories.length > 0
        ? initialData.categories
        : defaultMenuSectionData.categories,
  };

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || hasTrackedView.current) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window))
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedView.current) {
            hasTrackedView.current = true;
            try {
              trackEvent("viewed_menu_section");
            } catch (err) {
              console.warn("Analytics error:", err);
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const activeCategories =
    data.categories && data.categories.length > 0
      ? data.categories
      : defaultMenuSectionData.categories;

  const [activeTab, setActiveTab] = useState<string>(
    activeCategories[0]?.key || activeCategories[0]?.label || "przystawki"
  );

  const resolvedActiveTab = activeCategories.some(
    (cat) => (cat.key || cat.label) === activeTab
  )
    ? activeTab
    : activeCategories[0]?.key || activeCategories[0]?.label || "przystawki";

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative bg-[#FFFDF6] py-28 md:py-40"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={false}
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
          {data.description && data.description.trim() && (
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#960C3F]/60">
              {data.description}
            </p>
          )}
          <Separator className="mx-auto mt-8 w-16 bg-[#D9A261]/40" />
        </motion.div>

        {/* Tabs — all categories remain in DOM for SEO indexing */}
        {activeCategories && activeCategories.length > 0 && (
          <div className="mt-16">
            <div
              role="tablist"
              aria-label="Kategorie karty dań"
              className="mx-auto flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible scrollbar-none [::-webkit-scrollbar]:hidden snap-x snap-mandatory justify-start md:justify-center gap-1.5 p-2 w-full max-w-2xl h-auto bg-[#A6A6A6]/10 rounded-2xl"
            >
              {activeCategories.map((cat) => {
                const catKey = cat.key || cat.label;
                const isActive = resolvedActiveTab === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    role="tab"
                    id={`menu-tab-${catKey}`}
                    aria-selected={isActive}
                    aria-controls={`menu-panel-${catKey}`}
                    data-state={isActive ? "active" : "inactive"}
                    onClick={() => setActiveTab(catKey)}
                    className={`shrink-0 snap-center text-xs sm:text-sm transition-all px-4 py-2.5 rounded-xl cursor-pointer ${
                      isActive
                        ? "bg-[#CA5254] text-[#FFFDF6] font-bold shadow-md"
                        : "text-[#960C3F] hover:text-[#CA5254]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {activeCategories.map((cat) => {
              const catKey = cat.key || cat.label;
              const isActive = resolvedActiveTab === catKey;
              return (
                <div
                  key={catKey}
                  id={`menu-panel-${catKey}`}
                  role="tabpanel"
                  aria-labelledby={`menu-tab-${catKey}`}
                  className={isActive ? "mt-12 block" : "mt-12 hidden"}
                >
                  <h3 className="sr-only">{cat.label}</h3>
                  <div className="divide-y divide-[#A6A6A6]/15">
                    {cat.items?.map((item, i) => (
                      <MenuItem
                        key={item.name + i}
                        item={{ ...item, id: String(i) }}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Seasonal teaser */}
        <motion.p
          initial={false}
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
