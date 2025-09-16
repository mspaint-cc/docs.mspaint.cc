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
  name: "Obsidian",
  children: [
    { type: "separator", name: "Introduction" },
    { type: "page", name: "Getting Started", url: "/obsidian/" },
    { type: "page", name: "Installation", url: "/obsidian/installation" },
    { type: "page", name: "Contributing", url: "/obsidian/contributing" },

    { type: "separator", name: "Core" },
    {
      type: "page",
      name: "Library",
      url: "/obsidian/core/library/",
    },
    {
      type: "page",
      name: "SaveManager",
      url: "/obsidian/core/addons/savemanager",
    },
    {
      type: "page",
      name: "ThemeManager",
      url: "/obsidian/core/addons/thememanager",
    },

    { type: "separator", name: "Structure" },
    {
      type: "page",
      name: "Tabs",
      url: "/obsidian/structure/tabs",
    },
    {
      type: "page",
      name: "Groupboxes",
      url: "/obsidian/structure/groupboxes",
    },
    {
      type: "page",
      name: "Tabboxes",
      url: "/obsidian/structure/tabboxes",
    },

    { type: "separator", name: "UI Elements" },
    {
      type: "page",
      name: "Labels",
      url: "/obsidian/elements/labels",
    },
    {
      type: "page",
      name: "Buttons",
      url: "/obsidian/elements/buttons",
    },
    {
      type: "page",
      name: "Toggles",
      url: "/obsidian/elements/toggles",
    },
    { type: "page", name: "Inputs", url: "/obsidian/elements/inputs" },
    {
      type: "page",
      name: "Sliders",
      url: "/obsidian/elements/sliders",
    },
    {
      type: "page",
      name: "Dropdowns",
      url: "/obsidian/elements/dropdowns",
    },
    {
      type: "page",
      name: "Keybinds",
      url: "/obsidian/elements/keybinds",
    },
    {
      type: "page",
      name: "Color Pickers",
      url: "/obsidian/elements/colorpickers",
    },
    {
      type: "page",
      name: "Dividers",
      url: "/obsidian/elements/dividers",
    },
    {
      type: "page",
      name: "Viewports",
      url: "/obsidian/elements/viewports",
    },
    { type: "page", name: "Images", url: "/obsidian/elements/images" },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...baseOptions} tree={docsTree}>
      {children}
    </DocsLayout>
  );
}
