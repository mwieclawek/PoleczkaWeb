import React from "react";
import { client } from "@/sanity/client";
import MenuSectionClient, { MenuSectionData } from "./MenuSectionClient";

export default async function MenuSection() {
  const data: MenuSectionData | null = await client
    .fetch<MenuSectionData | null>(`*[_type == "menuSection"][0]{
      seasonTag,
      title,
      description,
      footerNote,
      categories[]{
        key,
        label,
        items[]{
          name,
          description,
          price,
          highlighted
        }
      }
    }`)
    .catch(() => null);

  return <MenuSectionClient initialData={data} />;
}
