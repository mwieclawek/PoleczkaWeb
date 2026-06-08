import React from 'react';
import { motion } from 'framer-motion';

const seasons = [
  {
    name: 'Wiosna',
    months: 'Marzec — Maj',
    color: 'bg-green-50 border-green-200',
    accent: 'text-green-700',
    ingredients: [
      'Pokrzywa', 'Szparagi', 'Rzodkiewka', 'Szczypiorek',
      'Młody bób', 'Mirabelki', 'Botwinka', 'Szczaw',
    ],
    note: 'Najkrótszy sezon. Gotujemy szybko i lekko.',
  },
  {
    name: 'Lato',
    months: 'Czerwiec — Sierpień',
    color: 'bg-amber-50 border-amber-200',
    accent: 'text-amber-700',
    ingredients: [
      'Pomidory Malinowe', 'Ogórek gruntowy', 'Chłodnik z kefiru', 'Wiśnia mirobalan',
      'Agrest', 'Cukinia z kwiatem', 'Kukurydza', 'Czarna porzeczka',
    ],
    note: 'Maksimum smaku przy minimum przetwarzania.',
  },
  {
    name: 'Jesień',
    months: 'Wrzesień — Listopad',
    color: 'bg-orange-50 border-orange-200',
    accent: 'text-orange-700',
    ingredients: [
      'Grzyby leśne', 'Burak ćwikłowy', 'Dynia Hokkaido', 'Jabłko reneta',
      'Dziczyzna z Gór Sowich', 'Orzech włoski', 'Pigwa', 'Kapusta biała',
    ],
    note: 'Nasz ulubiony sezon. Piwnica pełna słoików.',
  },
  {
    name: 'Zima',
    months: 'Grudzień — Luty',
    color: 'bg-blue-50 border-blue-200',
    accent: 'text-secondary',
    ingredients: [
      'Kiszona kapusta', 'Burak kiszony', 'Suszone grzyby', 'Śliwka wędzona',
      'Pstrąg tęczowy', 'Korzeń pietruszki', 'Seler', 'Majeranek suszony',
    ],
    note: 'Żyjemy z zapasów. Fermentacja i suszenie przez cały rok.',
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-28 bg-background border-t border-border">
      <div className="container px-6 md:px-12 mx-auto">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.25em] uppercase text-secondary font-sans mb-4">Filozofia</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Gotujemy tym, <br />co rośnie teraz.
            </h2>
          </motion.div>
          <motion.p
            className="text-sm text-foreground/45 max-w-xs leading-relaxed font-sans"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Karta nigdy nie jest stała. Zależy od pogody, od dostawców, od tego, 
            co szef kuchni znalazł rano na targu.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-border">
          {seasons.map((season, i) => (
            <motion.div
              key={i}
              className="bg-background p-8 md:p-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              data-testid={`season-card-${i}`}
            >
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h3 className={`text-2xl font-serif font-bold ${season.accent}`}>{season.name}</h3>
                  <p className="text-xs text-foreground/30 font-sans tracking-wider mt-1">{season.months}</p>
                </div>
                <span className="text-3xl font-serif text-foreground/8 font-bold select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <ul className="space-y-2 mb-8">
                {season.ingredients.map((ing, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-foreground/65 font-sans">
                    <span className="w-1 h-1 rounded-full bg-current shrink-0 opacity-40" />
                    {ing}
                  </li>
                ))}
              </ul>

              <div className="border-t border-border pt-5">
                <p className="text-xs text-foreground/35 font-sans italic leading-relaxed">{season.note}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
