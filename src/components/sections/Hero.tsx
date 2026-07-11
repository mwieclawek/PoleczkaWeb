import React from "react";
import { client } from "@/sanity/client";
import HeroClient, { HeroData } from "./HeroClient";

export default async function Hero() {
  const data: HeroData | null = await client
    .fetch<HeroData | null>(`*[_type == "hero"][0]{
      tagline,
      titleLine1,
      titleLine2,
      titleLine3,
      subtitle,
      ctaPrimaryText,
      ctaPrimaryHref,
      ctaSecondaryText,
      ctaSecondaryHref
    }`)
    .catch(() => null);

  return <HeroClient initialData={data} />;
}
