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
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params ?? {});
}

/**
 * Pre-defined event helpers for common actions.
 */
export const analytics = {
  reservationSubmitted: (guests: string) =>
    trackEvent("reservation_submitted", { guests }),

  reservationModalOpened: () => trackEvent("reservation_modal_opened"),

  menuViewed: () => trackEvent("menu_section_viewed"),

  ctaClicked: (label: string) =>
    trackEvent("cta_clicked", { button_label: label }),
};
