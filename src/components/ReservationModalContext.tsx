"use client";

import React, { createContext, useContext, useState } from "react";

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

  return (
    <ReservationModalContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
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
