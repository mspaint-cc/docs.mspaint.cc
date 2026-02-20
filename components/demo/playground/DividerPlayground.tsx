"use client";

import Divider from "@/components/obsidian/elements/Divider";
import { CopyPseudoComponent } from "./shared/CopyComponent";
import Button from "@/components/obsidian/elements/Button";
import { UIStateProvider } from "@/components/obsidian/UIStateProvider";
import Toggle from "@/components/obsidian/elements/Toggle";

import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { useState } from "react";

export default function DividerPlayground() {
  const [text, setText] = useState("");
  const [marginTop, setMarginTop] = useState<number | undefined>();
  const [marginBottom, setMarginBottom] = useState<number | undefined>();
  const [margin, setMargin] = useState<number | undefined>();

  const activeMarginTop = marginTop !== undefined ? marginTop : margin || 0;
  const activeMarginBottom = marginBottom !== undefined ? marginBottom : margin || 0;

  function generatePseudoCode() {
    if (activeMarginTop === 0 && activeMarginBottom === 0) {
      if (!text) return `Groupbox:AddDivider()`;
      return `Groupbox:AddDivider("${text.replaceAll('"', '\\"')}")`;
    }

    const safeText = text ? `\n\tText = "${text.replaceAll('"', '\\"')}",` : "";

    if (marginTop === undefined && marginBottom === undefined && margin !== undefined) {
      return `Groupbox:AddDivider({${safeText}\n\tMargin = ${margin}\n})`;
    }

    if (activeMarginTop === activeMarginBottom) {
      return `Groupbox:AddDivider({${safeText}\n\tMargin = ${activeMarginTop}\n})`;
    }

    return `Groupbox:AddDivider({${safeText}\n\tMarginTop = ${activeMarginTop},\n\tMarginBottom = ${activeMarginBottom}\n})`;
  }

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[250px] relative">
      <CopyPseudoComponent codegenfunc={generatePseudoCode} />

      <div className="flex items-center justify-center min-h-[150px] relative">
        <div className="w-[50%] max-sm:w-[90%] max-md:w-[80%] max-lg:w-[60%] flex flex-col gap-2 mx-auto">
          <UIStateProvider>
            <Toggle text="Create Logs" checked={false} risky={false} />
            <Divider text={text} marginTop={activeMarginTop} marginBottom={activeMarginBottom} />
            <Button text="Join Discord" subButton={{ text: "Copy Link" }} />
            <Button text="Unload" />
          </UIStateProvider>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="divider-text-input">
            Divider text
          </LabelPrimitive>
          <Input
            id="divider-text-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enter divider text..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="divider-general-m-input">
              Margin
            </LabelPrimitive>
            <Input
              id="divider-general-m-input"
              type="number"
              value={margin !== undefined ? margin : ""}
              onChange={(event) =>
                setMargin(
                  event.target.value ? Number(event.target.value) : undefined
                )
              }
              placeholder="0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="divider-mt-input">
              Margin Top
            </LabelPrimitive>
            <Input
              id="divider-mt-input"
              type="number"
              value={marginTop !== undefined ? marginTop : ""}
              onChange={(event) =>
                setMarginTop(
                  event.target.value ? Number(event.target.value) : undefined
                )
              }
              placeholder="0 (Overrides Margin)"
            />
          </div>
          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="divider-mb-input">
              Margin Bottom
            </LabelPrimitive>
            <Input
              id="divider-mb-input"
              type="number"
              value={marginBottom !== undefined ? marginBottom : ""}
              onChange={(event) =>
                setMarginBottom(
                  event.target.value ? Number(event.target.value) : undefined
                )
              }
              placeholder="0 (Overrides Margin)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
