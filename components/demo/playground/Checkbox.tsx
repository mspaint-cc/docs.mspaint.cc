"use client";

import Toggle from "@/components/obsidian/elements/Toggle";
import { UIStateProvider } from "@/components/obsidian/UIStateProvider";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";

import { useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";

export default function CheckboxPlayground() {
  const [text, setText] = useState("Enable Speed Hack");

  const memoizedToggle = useMemo(
    () => (
      <UIStateProvider>
        <Toggle text={text} checked={false} risky={false} />
      </UIStateProvider>
    ),
    [text]
  );

  function generatePseudoCode() {
    return `Groupbox:AddCheckbox("MyPseudoCodeCheckbox", {
	Text = "${text.replaceAll('"', '\\"')}",
	Default = true,
})
  
Toggles.MyPseudoCodeCheckbox:OnChanged(function(state)
    print("Toggle state changed to " .. tostring(state))
end)`;
  }

  return (
    <>
      <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[250px] relative">
        <CopyPseudoComponent codegenfunc={generatePseudoCode} />

        <div className="flex items-center justify-center min-h-[150px] relative">
          {memoizedToggle}
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="toggle-text">Toggle text</LabelPrimitive>
          <Input
            id="toggle-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>
      </div>
    </>
  );
}
