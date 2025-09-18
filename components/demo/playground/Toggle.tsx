"use client";

import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";

import { useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";
import { Switch } from "@/components/ui/switch";

export default function TogglePlayground() {
  const [text, setText] = useState("Enable Speed Hack");
  const [checked, setChecked] = useState(false);

  function generatePseudoCode() {
    return `Groupbox:AddToggle("MyPseudoCodeToggle", {
	Text = "${text.replaceAll('"', '\\"')}",
	Default = true,
})
  
Toggles.MyPseudoCodeToggle:OnChanged(function(state)
    print("Toggle state changed to " .. tostring(state))
end)`;
  }

  return (
    <>
      <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[250px] relative">
        <CopyPseudoComponent codegenfunc={generatePseudoCode} />

        <div className="flex items-center justify-center min-h-[150px] relative">
          <div className="justify-center items-center flex flex-row">
            <Switch
              onCheckedChange={(checked) => setChecked(checked)}
              checked={checked}
            />

            <span
              className={`ml-[18px] text-left block text-sm select-none transition-opacity`}
              style={{
                opacity: checked == true ? 0.8 : 0.6,
                color: "var(--color-white)",
              }}
            >
              {text}
            </span>
          </div>
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
