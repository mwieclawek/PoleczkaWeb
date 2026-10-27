import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/panel/",
          "/studio/",
          "/api/",
          "/coming-soon",
          "/wigilia",
        ],
      },
    ],
    sitemap: "https://bistropoleczka.pl/sitemap.xml",
  };
}
