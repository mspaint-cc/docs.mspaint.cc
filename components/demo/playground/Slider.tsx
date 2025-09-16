"use client";

import SliderElement from "@/components/obsidian/elements/Slider";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useEffect, useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";
import { UIStateProvider } from "@/components/obsidian/UIStateProvider";

function parseNumber(value: string, fallback: number) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export default function SliderPlayground() {
  const [text, setText] = useState("Slider");
  const [value, setValue] = useState(25);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [rounding, setRounding] = useState(0);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    setValue((current) => {
      const clamped = Math.min(Math.max(current, min), max);
      return Number.isFinite(clamped) ? clamped : min;
    });
  }, [min, max]);

  const memoizedSlider = useMemo(
    () => (
      <UIStateProvider>
        <SliderElement
          text={text}
          value={value}
          min={min}
          max={max}
          rounding={rounding >= 0 ? rounding : undefined}
          prefix={prefix}
          suffix={suffix}
          compact={compact}
          onValueChange={(next) => setValue(next)}
        />
      </UIStateProvider>
    ),
    [compact, max, min, prefix, rounding, suffix, text, value]
  );

  function escapeLuaString(input: string) {
    return input
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/"/g, '\\"');
  }

  function generatePseudoCode() {
    const lines = [
      `    Text = "${escapeLuaString(text)}",`,
      `    Default = ${value},`,
      `    Min = ${min},`,
      `    Max = ${max},`,
      `    Rounding = ${rounding},`,
    ];

    if (prefix.length > 0) {
      lines.push(`    Prefix = "${escapeLuaString(prefix)}",`);
    }

    if (suffix.length > 0) {
      lines.push(`    Suffix = "${escapeLuaString(suffix)}",`);
    }

    if (compact) {
      lines.push(`    Compact = true,`);
    }

    return ['Groupbox:AddSlider("MySlider", {', ...lines, "})"].join("\n");
  }

  const safeGeneratePseudoCode = () => {
    const result = generatePseudoCode();
    return typeof result === "string" ? result : "";
  };

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[320px] relative">
      <CopyPseudoComponent codegenfunc={safeGeneratePseudoCode} />

      <div className="flex items-center justify-center min-h-[150px] relative w-full">
        <div className="w-full max-w-xl">{memoizedSlider}</div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="slider-text">Label text</LabelPrimitive>
            <Input
              id="slider-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="slider-value">
              Current value
            </LabelPrimitive>
            <Input
              id="slider-value"
              type="number"
              value={value}
              onChange={(event) =>
                setValue(parseNumber(event.target.value, value))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="slider-min">Min</LabelPrimitive>
            <Input
              id="slider-min"
              type="number"
              value={min}
              onChange={(event) => setMin(parseNumber(event.target.value, min))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="slider-max">Max</LabelPrimitive>
            <Input
              id="slider-max"
              type="number"
              value={max}
              onChange={(event) => setMax(parseNumber(event.target.value, max))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="slider-rounding">Rounding</LabelPrimitive>
            <Input
              id="slider-rounding"
              type="number"
              value={rounding}
              min={0}
              onChange={(event) =>
                setRounding(
                  Math.max(0, parseNumber(event.target.value, rounding))
                )
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="slider-prefix">Prefix</LabelPrimitive>
            <Input
              id="slider-prefix"
              value={prefix}
              onChange={(event) => setPrefix(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="slider-suffix">Suffix</LabelPrimitive>
            <Input
              id="slider-suffix"
              value={suffix}
              onChange={(event) => setSuffix(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 md:self-end">
            <LabelPrimitive htmlFor="slider-compact">Compact</LabelPrimitive>
            <div className="flex items-center gap-2">
              <Switch
                id="slider-compact"
                checked={compact}
                onCheckedChange={setCompact}
              />
              <span className="text-sm text-muted-foreground">
                Toggle compact view
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
