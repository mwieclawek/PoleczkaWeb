import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const menuCategories = [
  {
    name: 'Zupy',
    note: 'Codziennie świeże',
    items: [
      { name: 'Żurek z jajem i chrzanem', description: 'Zakwas żytni 72h · jajko w 63°C · chrzan dolnośląski', price: '28' },
      { name: 'Barszcz z ćwikłą', description: 'Burak pieczony · śmietana 36% · koper', price: '26' },
      { name: 'Zupa z pieczonych pomidorów', description: 'Pomidory Malinowe · bazylia · oliwa z oliwek (sezon: lato)', price: '24' },
      { name: 'Rosół z kury wiejskiej', description: 'Wywar 6h · domowy makaron · natka', price: '28' },
    ],
  },
  {
    name: 'Dania główne',
    note: 'Menu zmienia się sezonowo',
    items: [
      { name: 'Pierogi z pokrzywą i twarogiem', description: 'Pokrzywa zbierana ręcznie · twaróg z Łagowa · masło klarowane', price: '38' },
      { name: 'Kacze nogi konfit', description: 'Kaczka ze Ślęży · kapusta biała · jabłko reneta · jałowiec', price: '72' },
      { name: 'Gołąbki w liściu kapusty', description: 'Wieprzowina + kasza gryczana · sos pomidorowy z bazylią', price: '46' },
      { name: 'Żeberka wieprzowe', description: 'Marynowane 24h · duszone z kapustą · purée z korzeni', price: '68' },
      { name: 'Ryba z Odry', description: 'Zależy od sezonu — sandacz lub pstrąg · masło z cytryną · szparagi lub kapusta', price: '64' },
    ],
  },
  {
    name: 'Desery',
    note: 'Z własnych przetworów',
    items: [
      { name: 'Sernik pieczony', description: 'Twaróg z Łagowa · skórka cytrynowa · konfitura z wiśni mirobalan', price: '28' },
      { name: 'Szarlotka z jabłek reneta', description: 'Jabłko cynamonowe · kruszonka · lody śmietankowe', price: '26' },
      { name: 'Kisiel z czarnej porzeczki', description: 'Porzeczka z własnego ogrodu · śmietana · mięta (lato)', price: '22' },
    ],
  },
];

export function MenuSection() {
  const [openCategory, setOpenCategory] = useState<string | null>('Dania główne');

  return (
    <section id="menu" className="py-28 bg-background border-t border-border">
      <div className="container px-6 md:px-12 mx-auto">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.25em] uppercase text-secondary font-sans mb-4">Karta dań</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Co dziś gotujemy
            </h2>
          </motion.div>
          <motion.p
            className="text-sm text-foreground/40 max-w-xs leading-relaxed font-sans"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Karta nie jest stała. Część dań dostępna jest tylko przez kilka tygodni w roku.
          </motion.p>
        </div>

        <div className="max-w-3xl border-t border-border">
          {menuCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
              className="border-b border-border"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.08 }}
            >
              <button
                className="w-full flex items-center justify-between py-5 text-left group"
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                data-testid={`menu-category-${catIndex}`}
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-lg font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                  <span className="text-xs text-foreground/30 font-sans tracking-wider hidden sm:block">{category.note}</span>
                </div>
                <span className={`text-foreground/30 text-lg transition-transform duration-300 ${openCategory === category.name ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openCategory === category.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 space-y-0">
                      {category.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between py-4 border-t border-border/40 first:border-t-0"
                          data-testid={`menu-item-${catIndex}-${index}`}
                        >
                          <div className="flex-1 pr-8">
                            <p className="font-sans font-medium text-foreground text-sm mb-1">{item.name}</p>
                            <p className="text-xs text-foreground/40 leading-relaxed font-sans">{item.description}</p>
                          </div>
                          <span className="font-sans text-sm font-medium text-foreground/60 whitespace-nowrap">{item.price} zł</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-xs text-foreground/30 font-sans tracking-wider mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Pełna karta dostępna w restauracji. Ceny zawierają VAT.
        </motion.p>

      </div>
    </section>
  );
}
