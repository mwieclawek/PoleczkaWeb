import React from "react";
import { client } from "@/sanity/client";
import ContactClient, { ContactData } from "./ContactClient";

export default async function Contact() {
  const data: ContactData | null = await client
    .fetch<ContactData | null>(`*[_type == "contact"][0]{
      tagline,
      title,
      subtitle,
      addressLabel,
      googleMapsUrl,
      phone,
      phoneClean,
      email,
      openingHours[]{
        days,
        hours
      },
      footerNote
    }`)
    .catch(() => null);

  return <ContactClient initialData={data} />;
}
