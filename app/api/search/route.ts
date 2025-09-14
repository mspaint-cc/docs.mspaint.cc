import { obsidian, source } from "@/lib/source";
import {
  createSearchAPI,
  type AdvancedIndex,
} from "fumadocs-core/search/server";
import type { InferPageType } from "fumadocs-core/source";
import type { NextRequest } from "next/server";
import type { StructuredData } from "fumadocs-core/mdx-plugins";

type Page = InferPageType<typeof source>;
type Tag = "mspaint" | "obsidian";

type DataWithStructure = Page["data"] & {
  structuredData: StructuredData;
  description?: string;
  keywords?: string;
};

function hasStructure(data: Page["data"]): data is DataWithStructure {
  return (
    typeof (data as unknown as Record<string, unknown>).structuredData !==
    "undefined"
  );
}

function toIndex(
  page: { url: string; data: Page["data"] },
  tag: Tag
): AdvancedIndex {
  if (!hasStructure(page.data)) {
    throw new Error(
      "Structured data missing; ensure MDX is configured with structure support."
    );
  }
  const data = page.data;
  return {
    id: page.url,
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    tag,
    structuredData: data.structuredData,
    url: page.url,
  };
}

const indexes = () => [
  ...source.getPages().map((p) => toIndex(p, "mspaint")),
  ...obsidian.getPages().map((p) => toIndex(p, "obsidian")),
];

const api = createSearchAPI("advanced", { indexes });

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query) return Response.json([]);

  const rawTag = request.nextUrl.searchParams.get("tag") ?? undefined;
  const tag = (rawTag === "all" ? undefined : rawTag) as Tag | undefined;
  const locale = request.nextUrl.searchParams.get("locale") ?? undefined;

  const results = await api.search(query, { tag, locale });
  return Response.json(results);
}

export const { staticGET } = api;
