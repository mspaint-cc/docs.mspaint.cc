import { NextRequest, NextResponse } from "next/server";

type MediaRange = {
  type: string;
  quality: number;
};

function parseAccept(value: string | null): MediaRange[] {
  if (!value) return [];

  return value
    .split(",")
    .map((part) => {
      const [type = "", ...params] = part.trim().split(";");
      const q = params.find((param) => param.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.split("=")[1] ?? "1") : 1;

      return {
        type: type.toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 1,
      };
    })
    .filter((range) => range.type.length > 0);
}

function bestQuality(ranges: MediaRange[], types: string[]): number {
  return ranges.reduce((best, range) => {
    if (types.includes(range.type)) return Math.max(best, range.quality);

    return best;
  }, 0);
}

function isMarkdownPreferred(request: NextRequest): boolean {
  const ranges = parseAccept(request.headers.get("accept"));
  const markdown = bestQuality(ranges, [
    "text/markdown",
    "text/x-markdown",
    "text/plain",
  ]);
  const html = bestQuality(ranges, ["text/html", "application/xhtml+xml"]);

  return markdown > 0 && markdown >= html;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isMarkdownPreferred(request)) return NextResponse.next();
  if (pathname.includes(".") || !pathname.startsWith("/obsidian")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const slug = pathname === "/obsidian" ? "" : pathname.slice("/obsidian/".length);

  url.pathname = slug ? `/llms.mdx/obsidian/${slug}` : "/llms.mdx/obsidian";

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/obsidian", "/obsidian/:path*"],
};
