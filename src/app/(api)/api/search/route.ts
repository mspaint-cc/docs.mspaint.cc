import { obsidian, source, cobalt } from "@/lib/source";
import {
  createSearchAPI,
  type AdvancedIndex,
} from "fumadocs-core/search/server";
import type { InferPageType } from "fumadocs-core/source";
import type { NextRequest } from "next/server";
import type { StructuredData } from "fumadocs-core/mdx-plugins";

type Page = InferPageType<typeof source>;
type Tag = "mspaint" | "obsidian" | "cobalt";

type DataWithStructure = Page["data"] & {
  structuredData: StructuredData;
  description?: string;
  keywords?: string;
};

function hasStructure(data: Page["data"]): data is DataWithStructure {
  return (
    typeof (data as unknown as Record<string, unknown>).structuredData !== "undefined" ||
    typeof (data as unknown as Record<string, any>).exports?.structuredData !== "undefined"
  );
}

function toIndex(
  page: { url: string; data: Page["data"] },
  tag: Tag
): AdvancedIndex & { keywords: any } {
  if (!hasStructure(page.data)) {
    throw new Error(
      "Structured data missing; ensure MDX is configured with structure support."
    );
  }

  const data = page.data as any;
  return {
    id: page.url,
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    tag,
    structuredData: data.exports?.structuredData || data.structuredData,
    url: page.url,
  };
}

const indexes = () => [
  ...source.getPages().map((p) => toIndex(p, "mspaint")),
  ...obsidian.getPages().map((p) => toIndex(p, "obsidian")),
  ...cobalt.getPages().map((p) => toIndex(p, "cobalt")),
];

const api = createSearchAPI("advanced", {
  indexes,
  tokenizer: {
    stemming: false,
  },
  search: {
    exact: false,
    tolerance: 0,
    threshold: 0,
  },
});

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query) return Response.json([]);

  const rawTag = request.nextUrl.searchParams.get("tag") ?? undefined;
  const tag = (rawTag === "all" ? undefined : rawTag) as Tag | undefined;
  const locale = request.nextUrl.searchParams.get("locale") ?? undefined;

  const results = await api.search(query, { tag, locale });
  return Response.json(results);
}