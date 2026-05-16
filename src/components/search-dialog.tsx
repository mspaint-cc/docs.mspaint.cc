"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useState } from "react";

const searchTags = [
  { name: "All", value: "all" },
  { name: "mspaint", value: "mspaint" },
  { name: "obsidian", value: "obsidian" },
  { name: "cobalt", value: "cobalt" },
];

export default function CustomSearchDialog(props: SharedProps) {
  const [tag, setTag] = useState("all");
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    api: "/api/search",
    tag,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>

        <div className="bg-fd-secondary/50 p-3">
          <TagsList tag={tag} onTagChange={(v) => setTag(v ?? "all")}>
            {searchTags.map((t) => (
              <TagsListItem key={t.value} value={t.value}>
                {t.name}
              </TagsListItem>
            ))}
          </TagsList>
        </div>

        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
