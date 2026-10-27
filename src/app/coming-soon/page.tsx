import React from "react";
import { client } from "@/sanity/client";
import ComingSoonClient, { ComingSoonData } from "./ComingSoonClient";

export const revalidate = 60;

export default async function ComingSoonPage() {
  const data: ComingSoonData | null = await client
    .fetch<ComingSoonData | null>(
      `*[_type == "comingSoon"][0]{
        addressTag,
        mainTitle,
        description,
        email,
        instagramUrl,
        facebookUrl
      }`,
      {},
      { next: { revalidate: 60 } }
    )
    .catch(() => null);

  return <ComingSoonClient initialData={data} />;
}
