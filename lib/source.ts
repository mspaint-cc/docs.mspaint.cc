import { docs, meta, obsidianDocs, obsidianMeta, cobaltDocs, cobaltMeta } from "@/.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/",
  source: createMDXSource(docs, meta),
});

export const obsidian = loader({
  baseUrl: "/obsidian",
  source: createMDXSource(obsidianDocs, obsidianMeta),
});

export const cobalt = loader({
  baseUrl: "/cobalt",
  source: createMDXSource(cobaltDocs, cobaltMeta),
});
