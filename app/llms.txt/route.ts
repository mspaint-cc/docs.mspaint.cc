import { getObsidianLLMsIndex } from "@/lib/obsidian-llm";

export const revalidate = false;

export function GET() {
  return new Response(getObsidianLLMsIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
