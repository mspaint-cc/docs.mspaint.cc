import type { Root } from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/app/(mspaint)/[[...slug]]/layout.config";
import { ReactNode } from "react";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/mspaint.png", sizes: "any" }],
    shortcut: ["/mspaint.png"],
    apple: ["/mspaint.png"],
  },
};

const docsTree: Root = {
  name: "Documentation",
  children: [
    { type: "separator", name: "Guides" },
    { type: "page", name: "Introduction", url: "/" },

    { type: "separator", name: "Key System" },
    { type: "page", name: "Step By Step Guide", url: "/key-system" },

    { type: "separator", name: "Purchase" },
    { type: "page", name: "Buy a Key", url: "https://www.mspaint.cc/buy", external: true },

    { type: "separator", name: "Addons" },
    { type: "page", name: "Getting Started", url: "/addons/getting_started" },
    { type: "page", name: "Migration Guide", url: "/addons/migrate" },
    { type: "page", name: "API", url: "/addons/api" },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...baseOptions} tree={docsTree} tabs={false}>
      {children}
    </DocsLayout>
  );
}
