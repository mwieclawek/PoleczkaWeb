"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import {
  Bell,
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
  Filter,
  Check,
  X,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
  const [localReservations, setLocalReservations] = useState<ReservationItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [activeTab, setActiveTab] = useState<
    "pending" | "confirmed" | "rejected" | "all"
  >("pending");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ReservationItem | null>(null);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Load localStorage reservations (fallback when Firebase not configured)
  const loadLocalReservations = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("poleczka_reservations") || "[]"
      ) as ReservationItem[];
      setLocalReservations(stored);
    } catch {
      setLocalReservations([]);
    }
  };

  // Update status in localStorage
  const updateLocalStatus = (id: string, status: "confirmed" | "rejected") => {
    try {
      const stored: ReservationItem[] = JSON.parse(
        localStorage.getItem("poleczka_reservations") || "[]"
      );
      const updated = stored.map((r) => (r.id === id ? { ...r, status } : r));
      localStorage.setItem("poleczka_reservations", JSON.stringify(updated));
      setLocalReservations(updated);
    } catch {}
  };

  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Audio helpers ---

  const playChime = () => {
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Harmonics: E5 + G#5 "ding-dong"
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(830.61, now + 0.2);
      gain2.gain.setValueAtTime(0.4, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.8);
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  };

  const unlockAudio = () => {
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
      audioCtxRef.current.resume().then(() => {
        setIsAudioUnlocked(true);
        playChime();
      });
    } catch {
      setIsAudioUnlocked(true);
    }
  };

  // --- Firestore real-time listener ---
  useEffect(() => {
    loadLocalReservations(); // initial load for fallback

    const q = query(
      collection(db, "reservations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setFirebaseError(null);
        const items: ReservationItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ReservationItem, "id">),
        }));
        setReservations(items);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        setFirebaseError(
          "Firebase is not configured. Add real Firebase keys to .env.local to see live reservations."
        );
      }
    );

    // Poll localStorage every 3s so new submissions appear without page reload
    const localPoll = setInterval(() => loadLocalReservations(), 3000);

    return () => {
      unsubscribe();
      clearInterval(localPoll);
    };
  }, []);

  // Merge Firebase + localStorage reservations (deduplicate by id)
  const allReservations = [
    ...reservations,
    ...localReservations.filter(
      (lr) => !reservations.some((r) => r.id === lr.id)
    ),
  ];

  // --- Chime loop when there are pending reservations ---
  useEffect(() => {
    const hasPending = allReservations.some((r) => r.status === "pending");

    if (hasPending && soundEnabled && isAudioUnlocked) {
      playChime();
      if (!chimeIntervalRef.current) {
        chimeIntervalRef.current = setInterval(() => playChime(), 3000);
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
  }, [allReservations, soundEnabled, isAudioUnlocked]);

  // Show modal for first pending reservation across both sources
  useEffect(() => {
    const pending = allReservations.filter((r) => r.status === "pending");
    setActiveModal(pending.length > 0 ? pending[0] : null);
  }, [reservations, localReservations]);

  // --- Update reservation status (Firestore or localStorage fallback) ---
  const updateStatus = async (
    id: string,
    status: "confirmed" | "rejected"
  ) => {
    if (id.startsWith("local_")) {
      updateLocalStatus(id, status);
      if (activeModal?.id === id) setActiveModal(null);
      return;
    }
    try {
      await updateDoc(doc(db, "reservations", id), { status });
      if (activeModal?.id === id) setActiveModal(null);
    } catch (err) {
      console.error("Failed to update reservation status:", err);
    }
  };

  // --- Filtering (uses merged allReservations) ---
  const filtered = allReservations.filter((r) => {
    const matchesDate = !selectedDate || r.date === selectedDate;
    const matchesStatus = activeTab === "all" || r.status === activeTab;
    return matchesDate && matchesStatus;
  });

  const pendingCount = allReservations.filter((r) => r.status === "pending").length;
  const confirmedCount = allReservations.filter(
    (r) => r.status === "confirmed" && (!selectedDate || r.date === selectedDate)
  ).length;
  const rejectedCount = allReservations.filter(
    (r) => r.status === "rejected" && (!selectedDate || r.date === selectedDate)
  ).length;
  const allCount = allReservations.filter(
    (r) => !selectedDate || r.date === selectedDate
  ).length;

  const statusLabel = (status: ReservationItem["status"]) =>
    status === "pending"
      ? "Pending"
      : status === "confirmed"
      ? "Confirmed"
      : "Rejected";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-amber-400">
              Reservations Panel
            </h1>
            <Badge
              variant="outline"
              className="bg-amber-400/10 text-amber-400 border-amber-400/30"
            >
              Bistro Poleczka Admin
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Real-time table management and notifications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isAudioUnlocked ? (
            <Button
              onClick={unlockAudio}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold gap-2 animate-pulse"
            >
              <Volume2 className="w-4 h-4" />
              Enable Sound
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={
                soundEnabled
                  ? "border-amber-500/50 text-amber-400"
                  : "border-slate-700 text-slate-400"
              }
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 mr-2" />
              ) : (
                <VolumeX className="w-4 h-4 mr-2" />
              )}
              {soundEnabled ? "Sound On" : "Muted"}
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

      {/* Firebase config warning */}
      {firebaseError && (
        <div className="max-w-7xl mx-auto mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl p-4 flex items-start gap-3 text-sm">
          <WifiOff className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Firebase not connected</p>
            <p className="text-amber-400/70">{firebaseError}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Status tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              {
                key: "pending",
                label: "Pending",
                count: pendingCount,
                activeClass: "bg-amber-500/10 border-amber-500/50 text-amber-400",
                icon: Clock,
                ping: pendingCount > 0,
              },
              {
                key: "confirmed",
                label: "Confirmed",
                count: confirmedCount,
                activeClass:
                  "bg-emerald-500/10 border-emerald-500/50 text-emerald-400",
                icon: CheckCircle,
              },
              {
                key: "rejected",
                label: "Rejected",
                count: rejectedCount,
                activeClass: "bg-rose-500/10 border-rose-500/50 text-rose-400",
                icon: XCircle,
              },
              {
                key: "all",
                label: "All",
                count: allCount,
                activeClass: "bg-blue-500/10 border-blue-500/50 text-blue-400",
                icon: Filter,
              },
            ] as const
          ).map(({ key, label, count, activeClass, icon: Icon, ping }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${
                activeTab === key
                  ? activeClass
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium">{label}</span>
                <Icon className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold mt-2">{count}</div>
              {ping && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
              )}
            </button>
          ))}
        </div>

        {/* Reservation list */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-200">
              Reservations for:{" "}
              <span className="text-amber-400">{selectedDate}</span>
            </h2>
            <span className="text-xs text-slate-400">
              Total: {filtered.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800 text-center py-12">
              <CardContent className="space-y-3">
                <Clock className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-base">
                  No reservations found for this date and filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
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
                        {item.date} at{" "}
                        <span className="font-semibold text-slate-200">
                          {item.time}
                        </span>
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
                      {statusLabel(item.status)}
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
                        <span>
                          Guests:{" "}
                          <strong className="text-slate-100">{item.guests}</strong>
                        </span>
                      </div>
                      {item.notes && (
                        <div className="flex items-start gap-2 text-slate-400 text-xs pt-1 border-t border-slate-800 mt-1">
                          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span className="italic">"{item.notes}"</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateStatus(item.id, "confirmed")}
                        disabled={item.status === "confirmed"}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium gap-1 text-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(item.id, "rejected")}
                        disabled={item.status === "rejected"}
                        className="flex-1 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Pending reservation alert modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl shadow-amber-500/20 space-y-6 relative">
            <div className="flex items-center gap-3 text-amber-400 border-b border-slate-800 pb-4">
              <div className="p-3 bg-amber-400/10 rounded-2xl animate-bounce">
                <Bell className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100">
                  NEW RESERVATION!
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  Awaiting staff confirmation
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-200">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 text-sm">Name:</span>
                <span className="font-bold text-lg text-slate-100">
                  {activeModal.name}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 text-sm">Phone:</span>
                <a
                  href={`tel:${activeModal.phone}`}
                  className="font-mono font-bold text-amber-400 text-base"
                >
                  {activeModal.phone}
                </a>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 text-sm">Date & Time:</span>
                <span className="font-semibold text-slate-100">
                  {activeModal.date} at {activeModal.time}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 text-sm">Guests:</span>
                <span className="font-semibold text-slate-100">
                  {activeModal.guests}
                </span>
              </div>
              {activeModal.notes && (
                <div className="pt-1">
                  <span className="text-slate-400 text-xs block mb-1">Notes:</span>
                  <p className="text-xs italic bg-slate-900 p-2 rounded border border-slate-800">
                    "{activeModal.notes}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => updateStatus(activeModal.id, "confirmed")}
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-xl gap-2 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle className="w-5 h-5" />
                ACCEPT
              </Button>
              <Button
                variant="outline"
                onClick={() => updateStatus(activeModal.id, "rejected")}
                className="flex-1 h-12 border-rose-500/50 text-rose-400 hover:bg-rose-500/10 font-bold text-base rounded-xl gap-2"
              >
                <XCircle className="w-5 h-5" />
                REJECT
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
