import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dishes = [
  {
    num: '01',
    name: 'Żurek z jajem',
    sub: 'Zakwas żytni · Jajko z wolnego wybiegu · Majeranek',
    description: 'Nasz żurek dojrzewa 72 godziny. Podajemy go z jajkiem gotowanym w 63°C i chrzanem prosto z Dolnego Śląska. Bez białej kiełbasy — bo nie potrzebuje.',
    season: 'Cały rok',
    seasonCode: 'all',
  },
  {
    num: '02',
    name: 'Pierogi z pokrzywą i twarogiem',
    sub: 'Pokrzywa · Twaróg z Łagowa · Masło klarowane',
    description: 'Wiosenne pierogi z młodą pokrzywą zbieraną ręcznie. Ciasto na maślance, farsz bez kompromisów. Sezon trwa dwa tygodnie.',
    season: 'Wiosna',
    seasonCode: 'spring',
  },
  {
    num: '03',
    name: 'Barszcz z ćwikłą i śmietaną',
    sub: 'Burak z Sulistrowic · Śmietana 36% · Koper',
    description: 'Czysty, głęboki, prawie czarny. Gotujemy wywar z pieczonych buraków przez trzy godziny. Nic nie przyśpiesza procesu.',
    season: 'Jesień / Zima',
    seasonCode: 'autumn',
  },
  {
    num: '04',
    name: 'Kacze nogi konfit',
    sub: 'Kaczka ze Ślęży · Kapusta biała · Jabłko reneta',
    description: 'Kaczka marynowana dobę w jałowcu i tymianku, a potem zanurzona w swoim własnym tłuszczu na siedem godzin. Podajemy z kapustą duszoną z jabłkiem.',
    season: 'Jesień',
    seasonCode: 'autumn',
  },
  {
    num: '05',
    name: 'Sernik pieczony',
    sub: 'Twaróg z Łagowa · Skórka cytrynowa · Konfitura z wiśni',
    description: 'Jeden przepis od dziesięciu lat. Pieczony w niskiej temperaturze, bez spękanej skórki. Konfitura z wiśni mirobalan z własnych przetworów.',
    season: 'Cały rok',
    seasonCode: 'all',
  },
  {
    num: '06',
    name: 'Chłodnik z botwinki',
    sub: 'Botwinka · Ogórek gruntowy · Kefir',
    description: 'Zimna zupa letnia, która istnieje tylko przez sześć tygodni w roku. Nikt nie czeka na nią tak jak my.',
    season: 'Lato',
    seasonCode: 'summer',
  },
];

const seasonColors: Record<string, string> = {
  all: 'text-foreground/40 border-border',
  spring: 'text-green-700 border-green-200',
  summer: 'text-amber-700 border-amber-200',
  autumn: 'text-orange-700 border-orange-200',
  winter: 'text-secondary border-secondary/20',
};

export function FeaturedDishes() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-28 bg-card border-t border-border">
      <div className="container px-6 md:px-12 mx-auto">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.25em] uppercase text-secondary font-sans mb-4">Nasze dania</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Wybrane z karty
            </h2>
          </motion.div>
          <motion.p
            className="text-sm text-foreground/40 max-w-xs leading-relaxed font-sans"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Kliknij danie, by dowiedzieć się więcej. Pełna karta zmienia się sezonowo.
          </motion.p>
        </div>

        <div className="border-t border-border">
          {dishes.map((dish, i) => (
            <motion.div
              key={i}
              className="border-b border-border"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <button
                className="w-full text-left py-6 flex items-start md:items-center gap-6 group"
                onClick={() => setExpanded(expanded === i ? null : i)}
                data-testid={`dish-item-${i}`}
              >
                <span className="text-xs font-mono text-foreground/20 pt-1 w-6 shrink-0">{dish.num}</span>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                    {dish.name}
                  </h3>
                  <span className="text-xs text-foreground/35 font-sans hidden md:block">{dish.sub}</span>
                </div>
                <span className={`text-[10px] tracking-[0.15em] uppercase font-sans border px-2.5 py-1 shrink-0 ${seasonColors[dish.seasonCode]}`}>
                  {dish.season}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 pl-12 pr-6 md:pr-32">
                      <p className="text-sm text-foreground/60 leading-relaxed font-sans max-w-2xl">
                        {dish.description}
                      </p>
                      <p className="text-xs text-foreground/30 font-sans mt-3 tracking-wider">{dish.sub}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
