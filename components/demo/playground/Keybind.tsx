"use client";

import Toggle from "@/components/obsidian/elements/Toggle";
import KeyPicker from "@/components/obsidian/elements/addons/KeyPicker";
import AddonContainer from "@/components/obsidian/elements/addons/AddonContainer";
import {
  UIStateProvider,
  useUIValue,
} from "@/components/obsidian/UIStateProvider";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useEffect, useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";

function splitList(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function escapeLuaString(input: string) {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/"/g, '\\"');
}

function formatLuaArray(values: string[]) {
  return `{ ${values
    .map((value) => `"${escapeLuaString(value)}"`)
    .join(", ")} }`;
}

const DEFAULT_MODES = ["Always", "Toggle", "Hold"];

type KeybindMode = "Toggle" | "Hold" | "Always" | "Press";

function KeybindControl({
  toggleText,
  defaultKey,
}: {
  toggleText: string;
  defaultKey: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <AddonContainer
        className="absolute inset-0 pointer-events-none"
        innerClassName="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto"
      >
        <Toggle text={toggleText} checked={false} risky={false} />
        <KeyPicker
          key={defaultKey}
          defaultValue={defaultKey}
          stateKey="playground:keybind"
          className="ml-4"
        />
      </AddonContainer>
    </div>
  );
}

export default function KeybindPlayground() {
  const [toggleText, setToggleText] = useState("Example Toggle");
  const [keybindText, setKeybindText] = useState("Example Keybind");
  const [defaultKey, setDefaultKey] = useState("F");
  const [mode, setMode] = useState<KeybindMode>("Toggle");
  const [syncToggleState, setSyncToggleState] = useState(false);
  const [waitForCallback, setWaitForCallback] = useState(false);
  const [noUI, setNoUI] = useState(false);
  const [modesInput, setModesInput] = useState("Always, Toggle, Hold");

  const modes = useMemo(() => {
    const entries = splitList(modesInput);
    return entries.length > 0 ? entries : DEFAULT_MODES;
  }, [modesInput]);

  useEffect(() => {
    if (mode !== "Press" && waitForCallback) {
      setWaitForCallback(false);
    }
  }, [mode, waitForCallback]);

  const memoizedPreview = useMemo(
    () => (
      <UIStateProvider>
        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">
          <KeybindControl toggleText={toggleText} defaultKey={defaultKey} />
        </div>
      </UIStateProvider>
    ),
    [defaultKey, toggleText]
  );

  function generatePseudoCode() {
    const lines = [
      `    Default = "${escapeLuaString(defaultKey)}",`,
      `    Text = "${escapeLuaString(keybindText)}",`,
      `    Mode = "${mode}",`,
    ];

    if (syncToggleState) {
      lines.push(`    SyncToggleState = true,`);
    }

    if (mode === "Press" && waitForCallback) {
      lines.push(`    WaitForCallback = true,`);
    }

    if (noUI) {
      lines.push(`    NoUI = true,`);
    }

    const modeSet = new Set(modes.map((entry) => entry.toLowerCase()));
    const defaultSet = new Set(
      DEFAULT_MODES.map((entry) => entry.toLowerCase())
    );
    const modesDiffer =
      modeSet.size !== defaultSet.size ||
      [...modeSet].some((entry) => !defaultSet.has(entry));

    if (modesDiffer) {
      lines.push(`    Modes = ${formatLuaArray(modes)},`);
    }

    lines.push(`    Callback = function(Value)
        print("Keybind pressed", Value)
    end,`);

    return [
      'local Toggle = Groupbox:AddToggle("MyToggle", {',
      `    Text = "${escapeLuaString(toggleText)}",`,
      "    Default = false,",
      "})",
      "",
      'local Keybind = Toggle:AddKeyPicker("MyKeybind", {',
      ...lines,
      "})",
      "",
      "Keybind:OnChanged(function()",
      '    print(\\"Key updated\\", Keybind.Value)',
      "end)",
    ].join("\n");
  }

  const safeGeneratePseudoCode = () => {
    const result = generatePseudoCode();
    return typeof result === "string" ? result : "";
  };

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[360px] relative">
      <CopyPseudoComponent codegenfunc={safeGeneratePseudoCode} />

      <div className="flex items-center justify-center min-h-[160px] relative w-full">
        <div className="w-full max-w-xl">{memoizedPreview}</div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="toggle-text">Toggle text</LabelPrimitive>
            <Input
              id="toggle-text"
              value={toggleText}
              onChange={(event) => setToggleText(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="keybind-text">Keybind text</LabelPrimitive>
            <Input
              id="keybind-text"
              value={keybindText}
              onChange={(event) => setKeybindText(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="keybind-default">
              Default key
            </LabelPrimitive>
            <Input
              id="keybind-default"
              value={defaultKey}
              onChange={(event) => setDefaultKey(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="keybind-mode">Mode</LabelPrimitive>
            <select
              id="keybind-mode"
              value={mode}
              onChange={(event) => setMode(event.target.value as KeybindMode)}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="Toggle">Toggle</option>
              <option value="Hold">Hold</option>
              <option value="Always">Always</option>
              <option value="Press">Press</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <LabelPrimitive htmlFor="keybind-modes">
              Custom modes (comma separated)
            </LabelPrimitive>
            <Input
              id="keybind-modes"
              value={modesInput}
              onChange={(event) => setModesInput(event.target.value)}
            />
            <span className="text-xs text-muted-foreground">
              Leave blank to use the default modes list.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="keybind-sync">
              Sync toggle state
            </LabelPrimitive>
            <div className="flex items-center gap-2">
              <Switch
                id="keybind-sync"
                checked={syncToggleState}
                onCheckedChange={setSyncToggleState}
              />
              <span className="text-sm text-muted-foreground">
                Keep toggle value in sync
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="keybind-noui">
              Hide from menu
            </LabelPrimitive>
            <div className="flex items-center gap-2">
              <Switch
                id="keybind-noui"
                checked={noUI}
                onCheckedChange={setNoUI}
              />
              <span className="text-sm text-muted-foreground">
                Do not show in keybind list
              </span>
            </div>
          </div>

          {mode === "Press" ? (
            <div className="flex flex-col gap-2">
              <LabelPrimitive htmlFor="keybind-wait">
                Wait for callback
              </LabelPrimitive>
              <div className="flex items-center gap-2">
                <Switch
                  id="keybind-wait"
                  checked={waitForCallback}
                  onCheckedChange={setWaitForCallback}
                />
                <span className="text-sm text-muted-foreground">
                  Lock keybind while callback runs
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
