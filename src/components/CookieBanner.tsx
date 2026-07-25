"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Read localStorage on client side to avoid hydration mismatches
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (status: "granted" | "denied") => {
    localStorage.setItem("cookie_consent", status);
    setShowBanner(false);

    // Update Google Consent Mode v2
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: status,
        ad_storage: status,
        ad_user_data: status,
        ad_personalization: status,
      });
    }

    // Notify other components (e.g., MicrosoftClarity) of consent state change
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cookie_consent_updated"));
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFDF6] border-t border-[#960C3F]/20 shadow-2xl p-4 sm:p-6 transition-all duration-300">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-[#960C3F]/80 text-center sm:text-left font-sans">
          <p className="font-semibold text-[#960C3F] mb-1">
            dbamy o Twoją prywatność 🍪
          </p>
          <p className="text-xs sm:text-sm text-[#960C3F]/70">
            Używamy plików cookies oraz narzędzi analitycznych do zbierania statystyk i ulepszania naszej strony. Możesz zaakceptować lub odrzucić opcjonalne pliki cookies.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => handleConsent("denied")}
            variant="outline"
            className="border-[#960C3F]/30 text-[#960C3F] hover:bg-[#960C3F]/10 px-5"
          >
            Odrzuć
          </Button>

          <Button
            onClick={() => handleConsent("granted")}
            className="bg-[#960C3F] text-[#FFFDF6] hover:bg-[#CA5254] px-5"
          >
            Akceptuj
          </Button>
        </div>
      </div>
    </div>
  );
}
