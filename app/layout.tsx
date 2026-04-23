import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";

import "./global.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.mspaint.cc"),
  title: {
    default: "mspaint docs",
    template: "%s | mspaint docs",
  },
  description:
    "Official documentation for the mspaint script hub, the Obsidian UI Library, and Cobalt.",
  applicationName: "mspaint docs",
  keywords: [
    "mspaint",
    "mspaint script",
    "roblox script hub",
    "obsidian ui library",
    "obsidian roblox",
    "linorialib",
    "cobalt",
    "roblox lua",
    "roblox executor",
  ],
  authors: [{ name: "mstudio45" }],
  creator: "mstudio45",
  publisher: "mstudio45",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "mspaint docs",
    title: "mspaint docs",
    description:
      "Official documentation for the mspaint script hub, the Obsidian UI Library, and Cobalt.",
    url: "https://docs.mspaint.cc",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "mspaint docs",
    description:
      "Official documentation for the mspaint script hub, the Obsidian UI Library, and Cobalt.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/mspaint.png",
    apple: "/mspaint.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            options: {
              defaultTag: "all",
              tags: [
                { name: "All", value: "all" },
                { name: "mspaint", value: "mspaint" },
                { name: "obsidian", value: "obsidian" },
              ],
              allowClear: false,
            },
          }}
        >
          <Toaster />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
