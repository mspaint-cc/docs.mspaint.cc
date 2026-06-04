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
        { type: "page", name: "cheapkeyz", url: "/purchase/cheapkeyz" },
        { type: "page", name: "YESU", url: "/purchase/YESU" },
        { type: "page", name: "bennnyr", url: "/purchase/bennnyr" },
        { type: "page", name: "temie.cc", url: "/purchase/temiecc" },
        { type: "page", name: "lunor.wtf", url: "/purchase/lunor" },
      ],
    },
    
    { type: "separator", name: "Key System" },
    { type: "page", name: "Step By Step Guide", url: "/key-system" },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...baseOptions} tree={docsTree} tabs={false}>
      {children}
    </DocsLayout>
  );
}
