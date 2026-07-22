"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  User,
  Phone,
  Mail,
  Users,
  FileText,
  Volume2,
  VolumeX,
  RefreshCw,
  Filter,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface ReservationItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt?: any;
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "rejected" | "all">("pending");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const [activeModalReservation, setActiveModalReservation] = useState<ReservationItem | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Funkcja generująca dźwięk powiadomienia (Web Audio API Chime)
  const playChimeSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Dwa czyste dźwięki harmonijne (E5 i G#5) tworzące przyjazne "ding-dong"
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now); // E5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(830.61, now + 0.2); // G#5
      gain2.gain.setValueAtTime(0.4, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.8);
    } catch (e) {
      console.warn("Audio Context Error:", e);
    }
  };

  const unlockAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      audioCtxRef.current.resume().then(() => {
        setIsAudioUnlocked(true);
        playChimeSound();
      });
    } catch (e) {
      setIsAudioUnlocked(true);
    }
  };

  // Real-time Firestore Listener
  useEffect(() => {
    const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: ReservationItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ReservationItem[];

        setReservations(items);

        // Znajdź rezerwację oczekującą (pending)
        const pendingItems = items.filter((item) => item.status === "pending");

        if (pendingItems.length > 0) {
          // Jeśli jest oczekująca rezerwacja, wyświetl modal najnowszej
          setActiveModalReservation(pendingItems[0]);
        } else {
          setActiveModalReservation(null);
        }
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Zapętlony dźwięk powiadomienia gdy aktywny jest modal / nowa rezerwacja pending
  useEffect(() => {
    const hasPending = reservations.some((r) => r.status === "pending");

    if (hasPending && soundEnabled && isAudioUnlocked) {
      playChimeSound();
      if (!chimeIntervalRef.current) {
        chimeIntervalRef.current = setInterval(() => {
          playChimeSound();
        }, 3000); // Co 3 sekundy
      }
    } else {
      if (chimeIntervalRef.current) {
        clearInterval(chimeIntervalRef.current);
        chimeIntervalRef.current = null;
      }
    }

    return () => {
      if (chimeIntervalRef.current) {
        clearInterval(chimeIntervalRef.current);
        chimeIntervalRef.current = null;
      }
    };
  }, [reservations, soundEnabled, isAudioUnlocked]);

  // Zmiana statusu rezerwacji
  const handleStatusChange = async (id: string, status: "confirmed" | "rejected") => {
    try {
      const reservationRef = doc(db, "reservations", id);
      await updateDoc(reservationRef, { status });

      if (activeModalReservation?.id === id) {
        setActiveModalReservation(null);
      }
    } catch (err) {
      console.error("Błąd zmiany statusu:", err);
    }
  };

  // Filtrowanie po dacie i tabie
  const filteredReservations = reservations.filter((r) => {
    const matchesDate = !selectedDate || r.date === selectedDate;
    const matchesStatus = activeTab === "all" || r.status === activeTab;
    return matchesDate && matchesStatus;
  });

  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed" && (!selectedDate || r.date === selectedDate)).length;
  const rejectedCount = reservations.filter((r) => r.status === "rejected" && (!selectedDate || r.date === selectedDate)).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header Panelu */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-amber-400">
              Panel Rezerwacji Tabletu
            </h1>
            <Badge variant="outline" className="bg-amber-400/10 text-amber-400 border-amber-400/30">
              Bistro Poleczka Admin
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Zarządzanie stolikami i powiadomienia w czasie rzeczywistym
          </p>
        </div>

        {/* Kontrolki Audio i Filtry */}
        <div className="flex flex-wrap items-center gap-3">
          {!isAudioUnlocked ? (
            <Button
              onClick={unlockAudio}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold gap-2 animate-pulse"
            >
              <Volume2 className="w-4 h-4" />
              Włącz dźwięk tabletu
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={soundEnabled ? "border-amber-500/50 text-amber-400" : "border-slate-700 text-slate-400"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              {soundEnabled ? "Dźwięk aktywny" : "Wyciszony"}
            </Button>
          )}

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <CalendarIcon className="w-4 h-4 text-amber-400" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-sm h-8 w-36 p-0 focus-visible:ring-0 text-slate-100"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Zakładki / Filtry statusów */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${
              activeTab === "pending"
                ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Oczekujące</span>
              <Clock className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-3xl font-bold mt-2">{pendingCount}</div>
            {pendingCount > 0 && (
              <span className="absolute top-3 right-3 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("confirmed")}
            className={`p-4 rounded-2xl border transition-all text-left ${
              activeTab === "confirmed"
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Potwierdzone</span>
              <CheckCircle className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-3xl font-bold mt-2">{confirmedCount}</div>
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`p-4 rounded-2xl border transition-all text-left ${
              activeTab === "rejected"
                ? "bg-rose-500/10 border-rose-500/50 text-rose-400"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Odrzucone</span>
              <XCircle className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-3xl font-bold mt-2">{rejectedCount}</div>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`p-4 rounded-2xl border transition-all text-left ${
              activeTab === "all"
                ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Wszystkie</span>
              <Filter className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-3xl font-bold mt-2">
              {reservations.filter((r) => !selectedDate || r.date === selectedDate).length}
            </div>
          </button>
        </div>

        {/* Lista rezerwacji */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-200">
              Rezerwacje na dzień: <span className="text-amber-400">{selectedDate}</span>
            </h2>
            <span className="text-xs text-slate-400">
              Łącznie: {filteredReservations.length} wpisów
            </span>
          </div>

          {filteredReservations.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800 text-center py-12">
              <CardContent className="space-y-3">
                <Clock className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-base">
                  Brak rezerwacji spełniających kryteria na podany dzień.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReservations.map((item) => (
                <Card
                  key={item.id}
                  className={`bg-slate-900 border transition-all hover:border-slate-700 ${
                    item.status === "pending"
                      ? "border-amber-500/50 shadow-lg shadow-amber-500/5"
                      : item.status === "confirmed"
                      ? "border-emerald-500/30"
                      : "border-rose-500/30 opacity-75"
                  }`}
                >
                  <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400" />
                        {item.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {item.date} godz. <span className="font-semibold text-slate-200">{item.time}</span>
                      </CardDescription>
                    </div>

                    <Badge
                      className={
                        item.status === "pending"
                          ? "bg-amber-400/20 text-amber-400 border-amber-400/30"
                          : item.status === "confirmed"
                          ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/30"
                          : "bg-rose-400/20 text-rose-400 border-rose-400/30"
                      }
                    >
                      {item.status === "pending" ? "Oczekuje" : item.status === "confirmed" ? "Potwierdzona" : "Odrzucona"}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm pt-0">
                    <div className="bg-slate-950/60 p-3 rounded-xl space-y-1.5 border border-slate-800/80">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <a href={`tel:${item.phone}`} className="hover:underline font-mono">
                          {item.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{item.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>Goście: <strong className="text-slate-100">{item.guests}</strong></span>
                      </div>
                      {item.notes && (
                        <div className="flex items-start gap-2 text-slate-400 text-xs pt-1 border-t border-slate-800 mt-1">
                          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span className="italic">"{item.notes}"</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(item.id, "confirmed")}
                        disabled={item.status === "confirmed"}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium gap-1 text-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Akceptuj
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(item.id, "rejected")}
                        disabled={item.status === "rejected"}
                        className="flex-1 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Odrzuć
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL / ALERT POWIADOMIENIA DLA NOWEJ REZERWACJI PENDING */}
      {activeModalReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl shadow-amber-500/20 space-y-6 relative">
            <div className="flex items-center gap-3 text-amber-400 border-b border-slate-800 pb-4">
              <div className="p-3 bg-amber-400/10 rounded-2xl animate-bounce">
                <Bell className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100">NOWA REZERWACJA!</h3>
                <p className="text-xs text-amber-400 font-medium">Oczekuje na akceptację obsługi</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-200">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 text-sm">Imię i Nazwisko:</span>
                <span className="font-bold text-lg text-slate-100">{activeModalReservation.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 text-sm">Telefon:</span>
                <a href={`tel:${activeModalReservation.phone}`} className="font-mono font-bold text-amber-400 text-base">
                  {activeModalReservation.phone}
                </a>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 text-sm">Data i Godzina:</span>
                <span className="font-semibold text-slate-100">
                  {activeModalReservation.date} godz. {activeModalReservation.time}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 text-sm">Liczba gości:</span>
                <span className="font-semibold text-slate-100">{activeModalReservation.guests}</span>
              </div>
              {activeModalReservation.notes && (
                <div className="pt-1">
                  <span className="text-slate-400 text-xs block mb-1">Uwagi:</span>
                  <p className="text-xs italic bg-slate-900 p-2 rounded border border-slate-800">
                    "{activeModalReservation.notes}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => handleStatusChange(activeModalReservation.id, "confirmed")}
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-xl gap-2 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle className="w-5 h-5" />
                AKCEPTUJ REZERWACJĘ
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusChange(activeModalReservation.id, "rejected")}
                className="flex-1 h-12 border-rose-500/50 text-rose-400 hover:bg-rose-500/10 font-bold text-base rounded-xl gap-2"
              >
                <XCircle className="w-5 h-5" />
                ODRZUĆ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
