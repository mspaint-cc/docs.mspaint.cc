import { obsidian } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "@/components/ai/page-actions";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = obsidian.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = `${page.url}.mdx`;
  const githubUrl = `https://github.com/notpoiu/docs.mspaint.cc/blob/main/content/obsidian/${page.file.path}`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pt-2 pb-6 mb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={githubUrl}
        />
      </div>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return obsidian.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = obsidian.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
