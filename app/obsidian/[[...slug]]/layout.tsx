import type { PageTree } from "fumadocs-core/server";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/app/obsidian/[[...slug]]/layout.config";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/obsidian.webp", sizes: "any" }],
    shortcut: ["/obsidian.webp"],
    apple: ["/obsidian.webp"],
  },
};

const docsTree: PageTree.Root = {
  name: "Documentation",
  children: [
    { type: "separator", name: "Introduction" },
    { type: "page", name: "Getting Started", url: "/addons/getting_started" },
    { type: "page", name: "Migration Guide", url: "/addons/migrate" },
    { type: "page", name: "API", url: "/addons/api" },

    { type: "separator", name: "Documentation" },
    { type: "page", name: "Getting Started", url: "/" },
    { type: "page", name: "Key System", url: "/key-system" },

    { type: "separator", name: "Purchase" },
    { type: "page", name: "Getting Started", url: "/purchase/getting_started" },
    {
      type: "folder",
      name: "Payment Methods",
      children: [
        { type: "page", name: "Official Shop", url: "/purchase/mspaintcc" },
        { type: "page", name: "BloxProducts", url: "/purchase/bloxproducts" },
        { type: "page", name: "YESU", url: "/purchase/YESU" },
        { type: "page", name: "Aero", url: "/purchase/aero" },
        { type: "page", name: "Munchen Keys", url: "/purchase/munchen_keys" },
      ],
    },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...baseOptions} tree={docsTree}>{children}</DocsLayout>
  );
}
