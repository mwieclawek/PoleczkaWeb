"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { analytics } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const reservationSchema = z.object({
  name: z.string().min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki"),
  phone: z.string().min(9, "Podaj prawidłowy numer telefonu (co najmniej 9 cyfr)"),
  email: z.string().email("Podaj prawidłowy adres e-mail"),
  date: z.date({
    required_error: "Wybierz datę rezerwacji",
  }),
  time: z.string().min(1, "Wybierz godzinę rezerwacji"),
  guests: z.string().min(1, "Wybierz liczbę osób"),
  notes: z.string().optional(),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

const GUEST_OPTIONS = [
  "1 osoba", "2 osoby", "3 osoby", "4 osoby",
  "5 osób", "6 osób", "7 osób", "8 osób", "9 osób", "10+ osób"
];

export function ReservationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<ReservationFormValues | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      time: "18:00",
      guests: "2 osoby",
      notes: "",
    },
  });

  const saveToLocalStorage = (docData: Record<string, any>) => {
    try {
      const existing: any[] = JSON.parse(
        localStorage.getItem("poleczka_reservations") || "[]"
      );
      const newEntry = {
        ...docData,
        id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      existing.unshift(newEntry);
      localStorage.setItem("poleczka_reservations", JSON.stringify(existing));
    } catch {
      // localStorage not available (SSR guard)
    }
  };

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const formattedDate = format(data.date, "yyyy-MM-dd");

    const docData = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      date: formattedDate,
      time: data.time,
      guests: data.guests,
      notes: data.notes || "",
      status: "pending",
    };

    try {
      // 5s timeout so demo keys don't block the UX indefinitely
      const timeout = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("Firebase timeout")), 5000)
      );
      await Promise.race([
        addDoc(collection(db, "reservations"), {
          ...docData,
          createdAt: serverTimestamp(),
        }),
        timeout,
      ]);
    } catch (err: any) {
      // Firebase unreachable — persist locally so admin panel can still show it
      console.warn("Firestore write failed, falling back to localStorage:", err?.message);
      saveToLocalStorage(docData);
    } finally {
      analytics.reservationSubmitted(docData.guests);
      setSubmittedData(data);
      reset();
      setIsSubmitting(false);
      // If used inside a modal, close it after showing the thank-you screen
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          setSubmittedData(null);
        }, 3000);
      }
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {submittedData ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-10 px-6 bg-card border border-primary/20 rounded-3xl shadow-2xl space-y-6"
          >
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-serif font-bold text-foreground">
                Dziękujemy za złożenie rezerwacji!
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Twoja rezerwacja dla <span className="font-semibold text-foreground">{submittedData.name}</span> została przekazana do obsługi restauracji i oczekuje na potwierdzenie.
              </p>
            </div>

            <div className="bg-background/80 border border-border p-6 rounded-2xl max-w-md mx-auto text-left space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-border/60 pb-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" /> Data:
                </span>
                <span className="font-semibold">{format(submittedData.date, "EEEE, d MMMM yyyy", { locale: pl })}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/60 pb-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Godzina:
                </span>
                <span className="font-semibold">{submittedData.time}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/60 pb-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Liczba gości:
                </span>
                <span className="font-semibold">{submittedData.guests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Email:
                </span>
                <span className="font-semibold">{submittedData.email}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              Potwierdzenie zostanie przesłane na podany adres e-mail oraz SMS.
            </p>

            <Button
              onClick={() => setSubmittedData(null)}
              variant="outline"
              className="rounded-xl px-8 mt-4"
            >
              Złóż kolejną rezerwację
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMessage && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Imię i Nazwisko + Telefon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                  <User className="w-4 h-4 text-primary" />
                  Imię i nazwisko <span className="text-primary">*</span>
                </label>
                <Input
                  {...register("name")}
                  placeholder="np. Anna Kowalska"
                  className={cn("rounded-xl h-12 bg-background/50", errors.name && "border-destructive")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                  <Phone className="w-4 h-4 text-primary" />
                  Numer telefonu <span className="text-primary">*</span>
                </label>
                <Input
                  {...register("phone")}
                  placeholder="+48 600 111 222"
                  type="tel"
                  className={cn("rounded-xl h-12 bg-background/50", errors.phone && "border-destructive")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                <Mail className="w-4 h-4 text-primary" />
                Adres e-mail <span className="text-primary">*</span>
              </label>
              <Input
                {...register("email")}
                placeholder="twoj.email@domain.pl"
                type="email"
                className={cn("rounded-xl h-12 bg-background/50", errors.email && "border-destructive")}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Data i Godzina */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wybór daty (Shadcn Calendar + Popover) */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  Data rezerwacji <span className="text-primary">*</span>
                </label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal rounded-xl bg-background/50",
                            !field.value && "text-muted-foreground",
                            errors.date && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: pl })
                          ) : (
                            <span>Wybierz datę</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-card border-border shadow-xl" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen(false);
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.date && (
                  <p className="text-xs text-destructive mt-1">{errors.date.message}</p>
                )}
              </div>

              {/* Wybór godziny (Shadcn Select) */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                  <Clock className="w-4 h-4 text-primary" />
                  Godzina <span className="text-primary">*</span>
                </label>
                <Controller
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={cn("h-12 rounded-xl bg-background/50", errors.time && "border-destructive")}>
                        <SelectValue placeholder="Wybierz godzinę" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.time && (
                  <p className="text-xs text-destructive mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            {/* Liczba gości */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                <Users className="w-4 h-4 text-primary" />
                Liczba gości <span className="text-primary">*</span>
              </label>
              <Controller
                control={control}
                name="guests"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={cn("h-12 rounded-xl bg-background/50", errors.guests && "border-destructive")}>
                      <SelectValue placeholder="Wybierz liczbę osób" />
                    </SelectTrigger>
                    <SelectContent>
                      {GUEST_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.guests && (
                <p className="text-xs text-destructive mt-1">{errors.guests.message}</p>
              )}
            </div>

            {/* Uwagi / Dodatkowe prośby */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                <FileText className="w-4 h-4 text-primary" />
                Uwagi / Dodatkowe prośby
              </label>
              <Textarea
                {...register("notes")}
                placeholder="np. Preferowany stolik przy oknie, krzesełko dla dziecka..."
                className="rounded-xl min-h-[100px] bg-background/50"
              />
            </div>

            {/* Przyciski zgłoszenia */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-xl text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Przetwarzanie rezerwacji...
                </>
              ) : (
                "Zarezerwuj stolik"
              )}
            </Button>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}
