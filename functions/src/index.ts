import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

/**
 * getLiveMenu — Bezpieczna funkcja HTTPS (middleware).
 *
 * Docelowo: pobiera aktualne menu z API GoPOS i zwraca je
 * w formacie JSON do front-endu (Next.js).
 *
 * Przepływ:
 *   1. Walidacja tokenu / autoryzacji (opcjonalnie – np. API key w headerze).
 *   2. Żądanie GET do GoPOS REST API z poświadczeniami
 *      przechowywanymi w Firebase Secret Manager / env vars.
 *   3. Transformacja odpowiedzi → zunifikowany format menu.
 *   4. Zwrócenie JSON z odpowiednimi nagłówkami CORS.
 */
export const getLiveMenu = onRequest(
  { cors: true, region: "europe-central2" },
  async (req, res) => {
    // --- Guard: akceptujemy tylko GET ---
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    logger.info("getLiveMenu invoked", { ip: req.ip });

    // TODO: Zamienić placeholder na prawdziwe wywołanie GoPOS API
    // const goposApiKey = process.env.GOPOS_API_KEY;
    // const response = await fetch("https://api.gopos.pl/v1/menu", { ... });

    const placeholderMenu = {
      restaurantName: "Poleczka Bistro",
      lastUpdated: new Date().toISOString(),
      categories: [
        {
          name: "Śniadania",
          items: [
            { id: "1", name: "Jajka po benedyktyńsku", price: 28.0 },
            { id: "2", name: "Owsianka z owocami sezonowymi", price: 22.0 },
          ],
        },
        {
          name: "Lunch",
          items: [
            { id: "3", name: "Bowl z halloumi", price: 34.0 },
            { id: "4", name: "Zupa dnia", price: 18.0 },
          ],
        },
      ],
    };

    res.status(200).json(placeholderMenu);
  }
);
