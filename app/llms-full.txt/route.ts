import { getObsidianFullLLMText } from "@/lib/obsidian-llm";

export const revalidate = false;

export async function GET() {
  return new Response(await getObsidianFullLLMText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
