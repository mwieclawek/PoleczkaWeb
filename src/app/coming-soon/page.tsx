import React from "react";
import { client } from "@/sanity/client";
import ComingSoonClient, { ComingSoonData } from "./ComingSoonClient";

export default async function ComingSoonPage() {
  const data: ComingSoonData | null = await client
    .fetch<ComingSoonData | null>(`*[_type == "comingSoon"][0]{
      addressTag,
      mainTitle,
      description,
      instagramUrl,
      facebookUrl
    }`)
    .catch(() => null);

  return <ComingSoonClient initialData={data} />;
}
