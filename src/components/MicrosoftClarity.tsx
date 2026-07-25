"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

/**
 * Microsoft Clarity — session recordings & heatmaps.
 * Rendered ONLY when user grants cookie consent ('granted' in localStorage).
 */
export function MicrosoftClarity() {
  const [isGranted, setIsGranted] = useState(false);
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || "xrz6w6krkw";

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("cookie_consent");
      setIsGranted(consent === "granted");
    };

    checkConsent();

    // Listen for consent updates from CookieBanner
    window.addEventListener("cookie_consent_updated", checkConsent);
    return () => {
      window.removeEventListener("cookie_consent_updated", checkConsent);
    };
  }, []);

  if (!isGranted || !clarityId) return null;

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  );
}
