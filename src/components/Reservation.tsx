"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar as CalendarIcon, Clock, Award } from "lucide-react";
import { ReservationForm } from "./ReservationForm";

export function Reservation() {
  return (
    <section id="reservation" className="py-24 bg-background relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-12 space-y-4">
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-1.5 text-xs uppercase tracking-widest font-bold"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Rezerwacja Stolika Online
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Zaplanuj wyjątkowe chwile w Bistro Poleczka
            </motion.h2>

            <motion.p
              className="text-muted-foreground max-w-xl mx-auto text-base"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Wybierz dogodny termin i godzinę. Po złożeniu rezerwacji nasz zespół wyśle Ci szybkie potwierdzenie.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-6 pt-2 text-xs font-medium text-foreground/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Godziny otwarcia: 12:00 – 22:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>Gwarancja świeżości i klimatu</span>
              </div>
            </motion.div>
          </div>

          {/* Form Card Container */}
          <motion.div
            className="bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/5 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ReservationForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
