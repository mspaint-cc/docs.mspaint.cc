import { obsidian } from "@/lib/source";
import type { InferPageType } from "fumadocs-core/source";

type ObsidianPage = InferPageType<typeof obsidian>;
type ObsidianPageData = ObsidianPage["data"] & {
  content?: string;
  description?: string;
};

const title = "Obsidian Documentation";
const description =
  "Documentation for Obsidian, a Roblox UI library for building configurable interfaces.";

function getPageData(page: ObsidianPage): ObsidianPageData {
  return page.data as ObsidianPageData;
}

function stripFrontmatter(content: string): string {
  if (!content.startsWith("---")) return content;

  const end = content.indexOf("\n---", 3);
  if (end === -1) return content;

  return content.slice(end + 4).trimStart();
}

function stripImports(content: string): string {
  return content
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("import "))
    .join("\n")
    .trim();
}

function pageLine(page: ObsidianPage): string {
  const data = getPageData(page);
  const suffix = data.description ? `: ${data.description}` : "";

  return `- [${data.title}](${page.url}.mdx)${suffix}`;
}

function getSortedPages(): ObsidianPage[] {
  return obsidian.getPages().toSorted((a, b) => {
    if (a.url === "/obsidian") return -1;
    if (b.url === "/obsidian") return 1;

    return a.url.localeCompare(b.url);
  });
}

export function getObsidianLLMsIndex(
  fullTextUrl = "/llms-full.txt"
): string {
  return [
    `# ${title}`,
    "",
    `> ${description}`,
    "",
    "## Docs",
    "",
    ...getSortedPages().map(pageLine),
    "",
    "## Full Text",
    "",
    `- [Complete Obsidian docs](${fullTextUrl}): Every Obsidian page combined into one Markdown document.`,
    "",
  ].join("\n");
}

export async function getObsidianLLMText(
  page: ObsidianPage
): Promise<string> {
  const data = getPageData(page);
  const content = data.content
    ? stripImports(stripFrontmatter(data.content))
    : data.structuredData?.contents.map((item) => item.content).join("\n\n") ??
      "";

  return [
    `# ${data.title} (${page.url})`,
    data.description,
    content,
    "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export async function getObsidianFullLLMText(): Promise<string> {
  const pages = await Promise.all(getSortedPages().map(getObsidianLLMText));

  return pages.join("\n\n");
}
