"use client";

import ObsidianImage from "@/components/obsidian/elements/Image";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";

import { useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";

function escapeLuaString(input: string) {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/"/g, '\\"');
}

function clamp01(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, 0), 1);
}

export default function ImagePlayground() {
  const [imageUrl, setImageUrl] = useState("rbxassetid://6767676767");
  const [transparency, setTransparency] = useState(0);
  const [bgTransparency, setBgTransparency] = useState(0);
  const [r, setR] = useState(1);
  const [g, setG] = useState(1);
  const [b, setB] = useState(1);
  const [rectOffset, setRectOffset] = useState("0, 0");
  const [rectSize, setRectSize] = useState("0, 0");
  const [scaleType, setScaleType] = useState("Fit");
  const [height, setHeight] = useState(200);

  const parsedOffset = useMemo(() => {
    const [x, y] = rectOffset.split(",").map((part) => Number(part.trim()));
    return { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 };
  }, [rectOffset]);

  const parsedSize = useMemo(() => {
    const [x, y] = rectSize.split(",").map((part) => Number(part.trim()));
    return { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 };
  }, [rectSize]);

  const pseudoCode = useMemo(() => {
    const lines = [`    Image = "${escapeLuaString(imageUrl)}",`];

    if (transparency !== 0) {
      lines.push(`    Transparency = ${Number(transparency.toFixed(3))},`);
    }

    if (r !== 1 || g !== 1 || b !== 1) {
      lines.push(
        `    Color = Color3.new(${Number(r.toFixed(3))}, ${Number(
          g.toFixed(3)
        )}, ${Number(b.toFixed(3))}),`
      );
    }

    if (bgTransparency !== 0) {
      lines.push(
        `    BackgroundTransparency = ${Number(bgTransparency.toFixed(3))},`
      );
    }

    if (parsedOffset.x !== 0 || parsedOffset.y !== 0) {
      lines.push(
        `    RectOffset = Vector2.new(${parsedOffset.x}, ${parsedOffset.y}),`
      );
    }

    if (parsedSize.x !== 0 || parsedSize.y !== 0) {
      lines.push(
        `    RectSize = Vector2.new(${parsedSize.x}, ${parsedSize.y}),`
      );
    }

    if (scaleType !== "Fit") {
      lines.push(`    ScaleType = Enum.ScaleType.${scaleType},`);
    }

    if (height !== 200) {
      lines.push(`    Height = ${height},`);
    }

    lines.push(`    Callback = function(image)
        print("Image changed!", image)
    end,`);

    return ['Groupbox:AddImage("MyImage", {', ...lines, "})"].join("\n");
  }, [
    b,
    g,
    height,
    imageUrl,
    parsedOffset,
    parsedSize,
    r,
    scaleType,
    transparency,
    bgTransparency,
  ]);

  const safeGeneratePseudoCode = () => pseudoCode;

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[360px] relative">
      <CopyPseudoComponent codegenfunc={safeGeneratePseudoCode} />

      <div className="flex items-center justify-center min-h-[200px] relative w-full">
        <div className="max-w-[200px] w-[200px] mb-5">
          <ObsidianImage
            image={imageUrl}
            transparency={transparency}
            scaleType={scaleType}
            color={{ r, g, b }}
            rectOffset={parsedOffset}
            height={height}
            rectSize={parsedSize}
            bgTransparency={bgTransparency}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="image-url">
            Image URL or asset
          </LabelPrimitive>
          <Input
            id="image-url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="image-height">Height (px)</LabelPrimitive>
          <Input
            id="image-height"
            type="number"
            value={height}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              setHeight(Number.isFinite(parsed) ? Math.max(parsed, 0) : 200);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive>Color tint (RGB 0-1)</LabelPrimitive>
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={r}
              type="number"
              step={0.01}
              onChange={(event) => setR(clamp01(Number(event.target.value), 1))}
            />
            <Input
              value={g}
              type="number"
              step={0.01}
              onChange={(event) => setG(clamp01(Number(event.target.value), 1))}
            />
            <Input
              value={b}
              type="number"
              step={0.01}
              onChange={(event) => setB(clamp01(Number(event.target.value), 1))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="image-transparency">
            Transparency (0-1)
          </LabelPrimitive>
          <Input
            id="image-transparency"
            type="number"
            step={0.01}
            value={transparency}
            onChange={(event) =>
              setTransparency(clamp01(Number(event.target.value), 0))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="image-bg-transparency">
            Background Transparency (0-1)
          </LabelPrimitive>
          <Input
            id="image-bg-transparency"
            type="number"
            step={0.01}
            value={bgTransparency}
            onChange={(event) =>
              setBgTransparency(clamp01(Number(event.target.value), 0))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="image-rect-offset">
            Rect offset (x, y)
          </LabelPrimitive>
          <Input
            id="image-rect-offset"
            value={rectOffset}
            onChange={(event) => setRectOffset(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="image-rect-size">
            Rect size (x, y)
          </LabelPrimitive>
          <Input
            id="image-rect-size"
            value={rectSize}
            onChange={(event) => setRectSize(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="image-scale-type">Scale type</LabelPrimitive>
          <select
            id="image-scale-type"
            value={scaleType}
            onChange={(event) => setScaleType(event.target.value)}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
          >
            <option value="Fit">Fit</option>
            <option value="Fill">Fill</option>
            <option value="Stretch">Stretch</option>
          </select>
        </div>
      </div>
    </div>
  );
}
