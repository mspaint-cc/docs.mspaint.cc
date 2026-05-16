"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Obsidian } from "@/components/obsidian/obsidian";

export default function ObsidianTestPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [uiData, setUiData] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleParse = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setUiData(parsed);
      setError(null);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setUiData(null);
    }
  }, [jsonInput]);

  const handleClear = useCallback(() => {
    setJsonInput("");
    setUiData(null);
    setError(null);
    textareaRef.current?.focus();
  }, []);

  const handleLoadFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setJsonInput(text);
        try {
          setUiData(JSON.parse(text));
          setError(null);
        } catch (err) {
          setError(`Invalid JSON: ${(err as Error).message}`);
          setUiData(null);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const memoizedObsidian = useMemo(() => {
    if (!uiData) return null;
    return (
      <Obsidian
        title="Obsidian Test"
        icon="/mspaint.png"
        footer="version: test"
        uiData={uiData}
      />
    );
  }, [uiData]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-[rgb(30,30,30)] px-6 py-4">
        <h1 className="text-xl font-semibold">Obsidian UI Test Page</h1>
        <p className="text-sm text-[rgb(120,120,120)] mt-1">
          Paste extracted JSON data or load a file to preview the Obsidian UI
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* JSON Input Panel */}
        <div className="w-[400px] min-w-[300px] border-r border-[rgb(30,30,30)] flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgb(30,30,30)]">
            <button
              onClick={handleParse}
              className="px-3 py-1.5 bg-[rgb(125,85,255)] hover:bg-[rgb(105,65,235)] text-white text-xs rounded transition-colors"
            >
              Parse & Render
            </button>
            <button
              onClick={handleLoadFile}
              className="px-3 py-1.5 bg-[rgb(30,30,30)] hover:bg-[rgb(45,45,45)] text-white text-xs rounded transition-colors"
            >
              Load File
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-[rgb(30,30,30)] hover:bg-[rgb(45,45,45)] text-white text-xs rounded transition-colors"
            >
              Clear
            </button>
          </div>

          {error && (
            <div className="mx-4 mt-2 px-3 py-2 bg-red-900/30 border border-red-800/50 rounded text-red-400 text-xs">
              {error}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste your ObsidianExtracted.json content here...'
            className="flex-1 w-full bg-transparent text-[rgb(180,180,180)] text-xs font-mono p-4 resize-none outline-none placeholder-[rgb(60,60,60)]"
            spellCheck={false}
          />
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          {memoizedObsidian ? (
            <div className="max-w-[720px] max-h-[600px] scale-[0.85] lg:scale-100">
              {memoizedObsidian}
            </div>
          ) : (
            <div className="text-[rgb(60,60,60)] text-sm select-none">
              Paste JSON and click &quot;Parse &amp; Render&quot; to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}