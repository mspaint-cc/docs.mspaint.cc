"use client";

import Toggle from "@/components/obsidian/elements/Toggle";
import AddonContainer from "@/components/obsidian/elements/addons/AddonContainer";
import ColorPicker from "@/components/obsidian/elements/addons/ColorPicker";
import { UIStateProvider } from "@/components/obsidian/UIStateProvider";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";

function escapeLuaString(input: string) {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/"/g, '\\"');
}

function formatColor3(r: number, g: number, b: number) {
  return `Color3.new(${Number(r.toFixed(3))}, ${Number(g.toFixed(3))}, ${Number(
    b.toFixed(3)
  )})`;
}

function InternalColorPickerPlayground() {
  const [toggleText, setToggleText] = useState("This is a toggle");
  const [title, setTitle] = useState("Some color");
  const [defaultColor, setDefaultColor] = useState("1,1,1");
  const [transparencyEnabled, setTransparencyEnabled] = useState(false);
  const [defaultTransparency, setDefaultTransparency] = useState(0);

  const parsedColor = useMemo(() => {
    const [r, g, b] = defaultColor
      .split(",")
      .map((part) => Number(part.trim()))
      .map((value) =>
        Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0
      );

    return {
      r: r ?? 1,
      g: g ?? 0,
      b: b ?? 0,
    };
  }, [defaultColor]);

  const memoizedPreview = useMemo(
    () => (
      <div className="flex flex-col items-center gap-3">
        <AddonContainer
          className="absolute inset-0 pointer-events-none"
          innerClassName="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto"
        >
          <Toggle text={toggleText} checked={false} risky={false} />
          <ColorPicker
            key={`${parsedColor.r}-${parsedColor.g}-${parsedColor.b}-${defaultTransparency}-${transparencyEnabled}`}
            defaultValue={parsedColor}
            title={title}
            stateKey="playground:colorpicker"
            className="ml-5"
          />
        </AddonContainer>
      </div>
    ),
    [defaultTransparency, parsedColor, title, toggleText, transparencyEnabled]
  );

  function generatePseudoCode() {
    const lines = [
      `    Default = ${formatColor3(
        parsedColor.r,
        parsedColor.g,
        parsedColor.b
      )},`,
    ];

    if (title.trim().length > 0) {
      lines.push(`    Title = "${escapeLuaString(title)}",`);
    }

    if (transparencyEnabled) {
      lines.push(
        `    Transparency = ${Number(defaultTransparency.toFixed(3))},`
      );
    }

    lines.push(`    Callback = function(Value)
        print("[cb] Color changed!", Value)
    end,`);

    return [
      'local Toggle = Groupbox:AddToggle("MyToggle", {',
      `    Text = "${escapeLuaString(toggleText)}",`,
      "    Default = true,",
      "})",
      "",
      'Toggle:AddColorPicker("MyColorPicker", {',
      ...lines,
      "})",
      "",
      "Options.MyColorPicker:OnChanged(function()",
      '    print("Color changed!", Options.MyColorPicker.Value)',
      "    if Options.MyColorPicker.Transparency then",
      '        print("Transparency changed!", Options.MyColorPicker.Transparency)',
      "    end",
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
        {memoizedPreview}
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="color-toggle-text">
              Toggle text
            </LabelPrimitive>
            <Input
              id="color-toggle-text"
              value={toggleText}
              onChange={(event) => setToggleText(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="color-title">
              Color picker title
            </LabelPrimitive>
            <Input
              id="color-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="color-default">
              Default color (r,g,b)
            </LabelPrimitive>
            <Input
              id="color-default"
              value={defaultColor}
              onChange={(event) => setDefaultColor(event.target.value)}
            />
            <span className="text-xs text-muted-foreground">
              Values must be between 0 and 1.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="color-transparency">
              Enable transparency
            </LabelPrimitive>
            <div className="flex items-center gap-2">
              <Switch
                id="color-transparency"
                checked={transparencyEnabled}
                onCheckedChange={setTransparencyEnabled}
              />
              <span className="text-sm text-muted-foreground">
                Allow transparency selection
              </span>
            </div>
            {transparencyEnabled ? (
              <Input
                id="color-transparency-value"
                type="number"
                value={defaultTransparency}
                min={0}
                max={1}
                step={0.01}
                onChange={(event) => {
                  const parsed = Number(event.target.value);
                  setDefaultTransparency(
                    Number.isFinite(parsed)
                      ? Math.min(Math.max(parsed, 0), 1)
                      : 0
                  );
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ColorPickerPlayground() {
  return (
    <UIStateProvider>
      <InternalColorPickerPlayground />
    </UIStateProvider>
  );
}
