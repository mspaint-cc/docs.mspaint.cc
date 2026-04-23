import type { MetadataRoute } from "next";
import { source, obsidian, cobalt } from "@/lib/source";

const SITE_URL = "https://docs.mspaint.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const collect = (pages: { url: string }[], priority: number) =>
    pages.map((page) => ({
      url: new URL(page.url, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    }));

  return [
    ...collect(source.getPages(), 0.8),
    ...collect(obsidian.getPages(), 0.8),
    ...collect(cobalt.getPages(), 0.8),
  ];
}
