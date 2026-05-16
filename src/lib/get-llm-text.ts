import { source, obsidian, cobalt } from "@/lib/source";

type PageType =
  | (typeof source)["$inferPage"]
  | (typeof obsidian)["$inferPage"]
  | (typeof cobalt)["$inferPage"];

export async function getLLMText(page: PageType) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}