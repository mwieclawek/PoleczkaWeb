"use client";

import React, { createContext, useContext, useState } from "react";
import { analytics } from "@/lib/analytics";

interface ReservationModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ReservationModalContext = createContext<ReservationModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function ReservationModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    analytics.reservationModalOpened();
  };

  return (
    <ReservationModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
    </ReservationModalContext.Provider>
  );
}

export function useReservationModal() {
  return useContext(ReservationModalContext);
}
