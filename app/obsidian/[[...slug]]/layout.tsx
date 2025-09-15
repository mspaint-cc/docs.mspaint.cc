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

    { type: "separator", name: "Obsidian Core" },
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
      name: "SaveManager",
      url: "/obsidian/core/addons/thememanager",
    },

    { type: "separator", name: "UI Elements" },
    {
      type: "page",
      name: "Labels",
      url: "/obsidian/elements/luau/labels",
    },
    {
      type: "page",
      name: "Buttons",
      url: "/obsidian/elements/luau/buttons",
    },
    {
      type: "page",
      name: "Toggles",
      url: "/obsidian/elements/luau/toggles",
    },
    { type: "page", name: "Inputs", url: "/obsidian/elements/luau/inputs" },
    {
      type: "page",
      name: "Sliders",
      url: "/obsidian/elements/luau/sliders",
    },
    {
      type: "page",
      name: "Dropdowns",
      url: "/obsidian/elements/luau/dropdowns",
    },
    {
      type: "page",
      name: "Keybinds",
      url: "/obsidian/elements/luau/keybinds",
    },
    {
      type: "page",
      name: "Color Pickers",
      url: "/obsidian/elements/luau/color-pickers",
    },
    {
      type: "page",
      name: "Dividers",
      url: "/obsidian/elements/luau/dividers",
    },
    {
      type: "page",
      name: "Viewports",
      url: "/obsidian/elements/luau/viewports",
    },
    { type: "page", name: "Images", url: "/obsidian/elements/luau/images" },
    /*{
      type: "folder",
      name: "React",
      children: [
        { type: "page", name: "Official Shop", url: "/purchase/mspaintcc" },
        { type: "page", name: "BloxProducts", url: "/purchase/bloxproducts" },
        { type: "page", name: "YESU", url: "/purchase/YESU" },
        { type: "page", name: "Aero", url: "/purchase/aero" },
        { type: "page", name: "Munchen Keys", url: "/purchase/munchen_keys" },
      ],
    },*/
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...baseOptions} tree={docsTree}>
      {children}
    </DocsLayout>
  );
}
