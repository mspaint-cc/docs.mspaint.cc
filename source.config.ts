import { defineDocs } from "fumadocs-mdx/config";
import { defineConfig } from "fumadocs-mdx/config";
import { transformerTwoslash } from "fumadocs-twoslash";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import type { ShikiTransformer } from "@shikijs/core/types";

export const { docs, meta } = defineDocs({
  dir: "content/docs",
});

export const { docs: obsidianDocs, meta: obsidianMeta } = defineDocs({
  dir: "content/obsidian",
});

export default defineConfig({
  mdxOptions: {
    providerImportSource: "@/app/mdx-components",
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      transformers: [
        // Fumadocs packages pull different @shikijs/types versions.
        // Cast to ShikiTransformer[] to unify types across versions.
        ...((rehypeCodeDefaultOptions.transformers ??
          []) as ShikiTransformer[]),
        transformerTwoslash() as unknown,
      ],
    },
  },
});
