/**
 * Analytics utilities for Google Analytics 4 (GA4).
 *
 * Usage:
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("reservation_submitted", { guests: "2" });
 */

type GtagCommand = "event" | "config" | "js" | "set";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Send a custom event to GA4.
 * Safe to call server-side — checks for window/gtag availability.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  try {
    if (typeof window === "undefined" || !window.gtag) return;
    window.gtag("event", eventName, params ?? {});
  } catch (err) {
    console.warn("Analytics trackEvent error:", err);
  }
}

/**
 * Pre-defined event helpers for common actions.
 */
export const analytics = {
  reservationIntent: () => trackEvent("reservation_intent"),

  reservationSuccess: (params?: Record<string, string | number | boolean>) =>
    trackEvent("reservation_success", params),

  viewedMenuSection: () => trackEvent("viewed_menu_section"),

  // Backward-compatible aliases
  reservationSubmitted: (guests: string) =>
    trackEvent("reservation_success", { guests }),

  reservationModalOpened: () => trackEvent("reservation_intent"),

  menuViewed: () => trackEvent("viewed_menu_section"),

  ctaClicked: (label: string) =>
    trackEvent("cta_clicked", { button_label: label }),
};

