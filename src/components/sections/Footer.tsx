import React from "react";
import { client } from "@/sanity/client";
import FooterClient, { SiteSettingsData } from "./FooterClient";

export default async function Footer() {
  const initialData: SiteSettingsData | null = await client
    .fetch<SiteSettingsData | null>(
      `*[_type == "siteSettings"][0]{
        footerDescription,
        contactEmail,
        instagramUrl,
        facebookUrl,
        copyrightText
      }`,
      {},
      { next: { revalidate: 60 } }
    )
    .catch(() => null);

  return <FooterClient initialData={initialData} />;
}
