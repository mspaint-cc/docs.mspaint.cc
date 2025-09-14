import type { PageTree } from "fumadocs-core/server";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/app/(docs)/[[...slug]]/layout.config";
import { ReactNode } from "react";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/mspaint.png", sizes: "any" }],
    shortcut: ["/mspaint.png"],
    apple: ["/mspaint.png"],
  },
};

const docsTree: PageTree.Root = {
  name: "Documentation",
  children: [
    { type: "separator", name: "Guides" },
    { type: "page", name: "Getting Started", url: "/" },
    { type: "page", name: "Key System", url: "/key-system" },

    { type: "separator", name: "Addons" },
    { type: "page", name: "Getting Started", url: "/addons/getting_started" },
    { type: "page", name: "Migration Guide", url: "/addons/migrate" },
    { type: "page", name: "API", url: "/addons/api" },

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
    <DocsLayout {...baseOptions} tree={docsTree}>
      {children}
    </DocsLayout>
  );
}
