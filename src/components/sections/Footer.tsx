import React from "react";
import { client } from "@/sanity/client";
import FooterClient, { SiteSettingsData } from "./FooterClient";

export default async function Footer() {
  let initialData: SiteSettingsData | null = null;
  try {
    initialData = await client.fetch<SiteSettingsData | null>(
      `*[_type == "siteSettings"][0]{
        footerDescription,
        instagramUrl,
        facebookUrl,
        copyrightText
      }`
    );
  } catch {
    initialData = null;
  }

  return <FooterClient initialData={initialData} />;
}
