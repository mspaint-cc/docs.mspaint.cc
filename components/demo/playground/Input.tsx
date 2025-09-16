"use client";

import InputElement from "@/components/obsidian/elements/Input";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";

import { useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";
import { UIStateProvider } from "@/components/obsidian/UIStateProvider";

export default function InputPlayground() {
  const [label, setLabel] = useState("Notification Sound ID");
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("rbxassetid://");

  const memoizedInput = useMemo(
    () => (
      <UIStateProvider>
        <InputElement
          text={label}
          value={value}
          placeholder={placeholder}
          onChanged={(event) => setValue(event.target.value)}
        />
      </UIStateProvider>
    ),
    [label, placeholder, value]
  );

  function generatePseudoCode() {
    return `Groupbox:AddInput("MyPseudoCodeInput", {
    Text = "${label.replaceAll('"', '\\"')}",
    Default = "${value.replaceAll('"', '\\"')}",
    Placeholder = "${placeholder.replaceAll('"', '\\"')}",
    Callback = function(value)
        print("Value changed", value)
    end
})`;
  }

  return (
    <>
      <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[250px] relative">
        <CopyPseudoComponent codegenfunc={generatePseudoCode} />

        <div className="flex items-center justify-center min-h-[150px] relative w-full">
          <div className="w-full max-w-sm">{memoizedInput}</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="input-label">Label text</LabelPrimitive>
            <Input
              id="input-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="input-placeholder">
              Placeholder
            </LabelPrimitive>
            <Input
              id="input-placeholder"
              value={placeholder}
              onChange={(event) => setPlaceholder(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="input-value">Current value</LabelPrimitive>
            <Input
              id="input-value"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
