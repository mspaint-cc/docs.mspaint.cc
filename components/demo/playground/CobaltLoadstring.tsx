"use client";

import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "cobalt-dev-base-url";
const DEFAULT_URL = "http://localhost:5500";

export default function CobaltLoadstringPlayground() {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_URL);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setBaseUrl(saved);
    setMounted(true);
  }, []);

  // Save to localStorage on change
  const handleBaseUrlChange = useCallback((value: string) => {
    setBaseUrl(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  const code = `-- Paste this into your executor\nloadstring(game:HttpGet("${baseUrl}/Distribution/Script.luau"))()`;

  if (!mounted) return null;

  return (
    <>
      <div className="flex flex-col gap-4 border rounded-lg p-4 relative">
        <DynamicCodeBlock lang="lua" code={code} />

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="cobalt-base-url">Base URL</LabelPrimitive>
          <Input
            id="cobalt-base-url"
            value={baseUrl}
            placeholder={DEFAULT_URL}
            onChange={(event) => handleBaseUrlChange(event.target.value)}
          />
          <p className="text-xs text-fd-muted-foreground">
            Change this to your Live Server URL or any other URL hosting the built script.
          </p>
        </div>
      </div>
    </>
  );
}
