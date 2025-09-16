import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";

import "./global.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

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
