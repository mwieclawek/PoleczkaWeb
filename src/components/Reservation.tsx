import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Reservation() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
  });

  const timeSlots = ['12:00', '13:00', '14:00', '15:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
  const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8+'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.phone && form.date && form.time) {
      setSubmitted(true);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="reservation" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-sm font-bold tracking-widest uppercase text-primary mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Rezerwacja
            </motion.h2>
            <motion.h3
              className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Zarezerwuj swój stolik
            </motion.h3>
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-2 text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <AlertCircle className="w-4 h-4" />
              Stolik na dziś — ostatnie wolne miejsca o 19:00 i 20:00
            </motion.div>
          </div>

          <motion.div
            className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {submitted ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h4 className="text-2xl font-serif font-bold text-foreground mb-2">
                  Rezerwacja przyjęta!
                </h4>
                <p className="text-foreground/70 mb-1">
                  Dziękujemy, {form.name}. Potwierdzenie wyślemy SMS-em na numer {form.phone}.
                </p>
                <p className="text-foreground/70">
                  Czekamy na Ciebie {form.date} o godz. {form.time} z {form.guests} osobami.
                </p>
                <p className="text-sm text-foreground/50 mt-6 font-serif italic">
                  Do zobaczenia przy stole!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Imię i nazwisko
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="Jan Kowalski"
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="+48 600 000 000"
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Data
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => handleChange('date', e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    data-testid="input-date"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Godzina
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleChange('time', slot)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          form.time === slot
                            ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                            : 'bg-background border-border text-foreground/70 hover:border-primary/50 hover:text-primary'
                        }`}
                        data-testid={`button-time-${slot}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Liczba gości
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {guestOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleChange('guests', option)}
                        className={`w-12 h-12 rounded-xl text-sm font-bold border transition-all ${
                          form.guests === option
                            ? 'bg-secondary text-secondary-foreground border-secondary shadow-md'
                            : 'bg-background border-border text-foreground/70 hover:border-secondary/50 hover:text-secondary'
                        }`}
                        data-testid={`button-guests-${option}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-lg font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                  data-testid="button-submit"
                >
                  Zarezerwuj stolik
                </Button>
                <p className="text-center text-xs text-foreground/40">
                  Potwierdzenie rezerwacji otrzymasz SMS-em w ciągu kilku minut.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
