import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";

import "./global.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

import CustomSearchDialog from "@/components/search-dialog";

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
  themeColor: "#0a0a0a",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} dark`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{ SearchDialog: CustomSearchDialog }}
          theme={{ enabled: false }}
        >
          <Toaster />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
