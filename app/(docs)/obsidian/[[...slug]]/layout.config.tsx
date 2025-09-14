import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <Image
          src="/obsidian.webp"
          width={25}
          height={25}
          alt="Logo"
          className="drop-shadow-[0_0_2px_rgba(255,255,255,0.1)]"
        />
        <span className="text-xl font-bold">Obsidian</span>
      </div>
    ),
    url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/obsidian"
        : "https://docs.mspaint.cc/obsidian",
  },
};
