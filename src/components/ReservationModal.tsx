"use client";

import React from "react";
import { useReservationModal } from "@/components/ReservationModalContext";
import { ReservationForm } from "@/components/ReservationForm";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ReservationModal() {
  const { isOpen, closeModal } = useReservationModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-4 top-[50%] z-[70] -translate-y-1/2 max-w-2xl mx-auto"
          >
            <div className="bg-[#FFFDF6] rounded-3xl shadow-2xl shadow-[#960C3F]/10 border border-[#960C3F]/10 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-[#960C3F]/10 shrink-0">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-[#960C3F]">
                    Zarezerwuj stolik
                  </h2>
                  <p className="text-sm text-[#960C3F]/60 mt-0.5">
                    Wybierz termin — potwierdzimy rezerwację wkrótce.
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  aria-label="Zamknij"
                  className="p-2 rounded-full text-[#960C3F]/50 hover:text-[#960C3F] hover:bg-[#960C3F]/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="overflow-y-auto p-8 pt-6">
                <ReservationForm onSuccess={closeModal} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
