"use client";

import Label from "@/components/obsidian/elements/Label";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";

import { useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";

export default function LabelPlayground() {
  const [text, setText] = useState(
    '[<font color="rgb(73, 230, 133)">Obsidian</font>] every text component (ex: Notification Title, Descriptions, etc.) supports <b>Rich Text</b> by default!'
  );

  const memoizedLabel = useMemo(() => <Label>{text}</Label>, [text]);

  function generatePseudoCode() {
    return `Groupbox:AddLabel("${text.replaceAll('"', '\\"')}")`;
  }

  return (
    <>
      <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[250px] relative">
        <CopyPseudoComponent codegenfunc={generatePseudoCode} />

        <div className="flex items-center justify-center min-h-[150px] relative">
          {memoizedLabel}
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="label-text">Label text</LabelPrimitive>
          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>
      </div>
    </>
  );
}
