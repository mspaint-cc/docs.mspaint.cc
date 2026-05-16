import type { Root } from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/app/(cobalt)/cobalt/[[...slug]]/layout.config";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/cobalt.png", sizes: "any" }],
    shortcut: ["/cobalt.png"],
    apple: ["/cobalt.png"],
  },
};

const docsTree: Root = {
  name: "Cobalt",
  children: [
    { type: "separator", name: "Introduction" },
    { type: "page", name: "Getting Started", url: "/cobalt/" },
    { type: "separator", name: "Development" },
    { type: "page", name: "Local Development", url: "/cobalt/development" },
    { type: "page", name: "Contributing", url: "/cobalt/contributing" },

    { type: "separator", name: "Plugins" },
    { type: "page", name: "Overview", url: "/cobalt/plugins/overview" },
    { type: "page", name: "API Reference", url: "/cobalt/plugins/api" },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...baseOptions} tree={docsTree} tabs={false}>
      {children}
    </DocsLayout>
  );
}
