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

  function generatePseudoCode() {
    return `Groupbox:AddDivider("${text.replaceAll('"', '\\"')}")`;
  }

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[250px] relative">
      <CopyPseudoComponent codegenfunc={generatePseudoCode} />

      <div className="flex items-center justify-center min-h-[150px] relative">
        <div className="w-[50%] max-sm:w-[90%] max-md:w-[80%] max-lg:w-[60%] flex flex-col gap-2 mx-auto">
          <UIStateProvider>
            <Toggle text="Create Logs" checked={false} risky={false} />
            <Divider text={text} />
            <Button text="Join Discord" subButton={{ text: "Copy Link" }} />
            <Button text="Unload" />
          </UIStateProvider>
        </div>
      </div>

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
    </div>
  );
}
