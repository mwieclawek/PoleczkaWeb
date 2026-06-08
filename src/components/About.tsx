import React from 'react';
import { motion } from 'framer-motion';

const values = [
  { num: '01', title: 'Sezonowość', body: 'Karta zmienia się cztery razy w roku. Gotujemy tym, co właśnie dojrzewa — bez wyjątków.' },
  { num: '02', title: 'Lokalność', body: 'Warzywa z Dolnego Śląska, ryby z Odry, grzyby z Gór Sowich. Skracamy łańcuch do minimum.' },
  { num: '03', title: 'Rzemiosło', body: 'Zakwasy, kiszonki, konfitury — wszystko robi się tutaj. Żadnych skrótów, tylko czas i precyzja.' },
];

export function About() {
  return (
    <section id="about" className="py-28 bg-background border-t border-border">
      <div className="container px-6 md:px-12 mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs tracking-[0.25em] uppercase text-secondary font-sans mb-4">O restauracji</p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight max-w-lg">
              Kuchnia, która słucha natury.
            </h2>
          </motion.div>
          <motion.p
            className="max-w-xs text-foreground/55 text-sm leading-relaxed font-sans md:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Bistro Poleczka działa we Wrocławiu od 2014 roku. Zaczęliśmy od jednej małej sali i przepisu na żurek, który przywędrował z Kujaw razem z naszym szefem kuchni.
          </motion.p>
        </div>

        {/* Full-width statement */}
        <motion.div
          className="border-t border-border pt-12 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="text-2xl md:text-3xl font-serif text-foreground/70 leading-relaxed max-w-4xl">
            "Autorska kuchnia polska nie oznacza dla nas dekonstrukcji bigosu. Oznacza rozumienie, skąd pochodzi każdy składnik, i szacunek do tego, co już jest doskonałe."
          </p>
          <div className="flex items-center gap-4 mt-8">
            <div className="w-8 h-px bg-primary" />
            <span className="text-sm text-foreground/40 font-sans tracking-wider">Michał Wiśniewski, Szef Kuchni</span>
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-border">
          {values.map((v, i) => (
            <motion.div
              key={i}
              className="py-10 md:pr-12 border-b md:border-b-0 md:border-r border-border last:border-r-0 md:pl-0 first:pl-0"
              style={{ paddingLeft: i > 0 ? undefined : 0 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <span className="text-xs text-foreground/25 font-mono mb-4 block">{v.num}</span>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">{v.title}</h3>
              <p className="text-sm text-foreground/55 leading-relaxed font-sans">{v.body}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
