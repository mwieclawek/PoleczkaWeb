import React from 'react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Katarzyna N.',
    location: 'Wrocław',
    text: 'Żurek podany bez białej kiełbasy brzmiał podejrzanie. Był najlepszy, jaki jadłam. Wróciłam tydzień później po chłodnik z botwinki.',
    date: 'Maj 2025',
    initials: 'KN',
  },
  {
    name: 'Piotr Z.',
    location: 'Kraków',
    text: 'Przyjechałem specjalnie na kacze nogi. Karta zmieniła się dwa dni wcześniej na zimową. Jadłem barszcz z ćwikłą i nie żałuję ani chwili.',
    date: 'Grudzień 2024',
    initials: 'PZ',
  },
  {
    name: 'Magdalena W.',
    location: 'Wrocław',
    text: 'Pierwsze miejsce w Polsce, gdzie serwują pierogi z pokrzywą i nie tłumaczą się z tego. Sezon trwa dwa tygodnie — zarezerwuj stolik z wyprzedzeniem.',
    date: 'Kwiecień 2025',
    initials: 'MW',
  },
  {
    name: 'Tomasz K.',
    location: 'Warszawa',
    text: 'Zabrałem tu partnerów z Berlina. Sernik z twarogu z Łagowa zamówili po raz drugi. Teraz piszą do mnie przed każdym przyjazdem do Wrocławia.',
    date: 'Marzec 2025',
    initials: 'TK',
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="py-28 bg-card border-t border-border">
      <div className="container px-6 md:px-12 mx-auto">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.25em] uppercase text-secondary font-sans mb-4">Opinie</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Co mówią goście
            </h2>
          </motion.div>
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-3xl font-serif font-bold text-foreground">4.9</span>
            <div>
              <div className="flex gap-0.5 text-primary text-sm">★★★★★</div>
              <p className="text-xs text-foreground/35 font-sans mt-0.5">847 opinii</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-card p-8 md:p-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              data-testid={`review-card-${index}`}
            >
              <p className="text-lg font-serif text-foreground/80 leading-relaxed mb-8">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-primary flex items-center justify-center text-xs font-bold text-primary font-mono">
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{review.name}</p>
                    <p className="text-xs text-foreground/35 font-sans">{review.location}</p>
                  </div>
                </div>
                <span className="text-xs text-foreground/25 font-sans tracking-wider">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
