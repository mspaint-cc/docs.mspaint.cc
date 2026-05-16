import { getLLMText } from "@/lib/get-llm-text";
import { obsidian } from "@/lib/source";
import { notFound } from "next/navigation";

export const revalidate = false;

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await props.params;
  const page = obsidian.getPage(slug);

  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return obsidian.generateParams();
}
