import React from "react";
import { client } from "@/sanity/client";
import AboutClient, { AboutData } from "./AboutClient";

export default async function About() {
  const data: AboutData | null = await client
    .fetch<AboutData | null>(`*[_type == "about"][0]{
      subtitle,
      heading,
      grandOpeningDate,
      history,
      principles
    }`)
    .catch(() => null);

  return <AboutClient initialData={data} />;
}
