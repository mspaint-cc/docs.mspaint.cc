import { docs, obsidianDocs, cobaltDocs } from "collections/server";
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
});

export const obsidian = loader({
  baseUrl: "/obsidian",
  source: obsidianDocs.toFumadocsSource(),
});

export const cobalt = loader({
  baseUrl: "/cobalt",
  source: cobaltDocs.toFumadocsSource(),
});
