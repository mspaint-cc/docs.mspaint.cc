import { docs, meta, obsidianDocs, obsidianMeta } from "@/.source";
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
