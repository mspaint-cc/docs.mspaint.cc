"use client";

import Button from "@/components/obsidian/elements/Button";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";

export default function ButtonPlayground() {
  const [text, setText] = useState("Button");
  const [hasSubButton, setHasSubButton] = useState(false);
  const [subButtonText, setSubButtonText] = useState("Sub button");

  const memoizedComponent = useMemo(
    () => (
      <Button
        text={text}
        subButton={hasSubButton ? { text: subButtonText } : undefined}
      />
    ),
    [text, hasSubButton, subButtonText]
  );

  function generatePseudoCode() {
    let code = `Groupbox:AddButton({
    Text = "${text.replaceAll('"', '\\"')}",
    Func = function()
        print("Button clicked!")
    end
})`;

    if (hasSubButton) {
      code += `:AddButton({
    Text = "${subButtonText.replaceAll('"', '\\"')}",
    Func = function()
        print("Sub button clicked!")
    end
})`;
    }

    return code;
  }

  return (
    <>
      <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[250px] relative">
        <CopyPseudoComponent codegenfunc={generatePseudoCode} />

        <div className="flex items-center justify-center min-h-[150px] relative w-full">
          {memoizedComponent}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex flex-1 flex-col gap-2">
              <LabelPrimitive htmlFor="button-text">Button text</LabelPrimitive>
              <Input
                id="button-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <LabelPrimitive htmlFor="subbutton-text">
                Sub button text
              </LabelPrimitive>
              <Input
                id="subbutton-text"
                value={subButtonText}
                onChange={(event) => setSubButtonText(event.target.value)}
                disabled={!hasSubButton}
              />
            </div>

            <div className="flex flex-col gap-2 md:self-stretch">
              <LabelPrimitive htmlFor="include-subbutton">
                Sub button
              </LabelPrimitive>
              <div className="flex items-center md:flex-1 md:justify-center">
                <Switch
                  id="include-subbutton"
                  checked={hasSubButton}
                  onCheckedChange={setHasSubButton}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Use the switch to enable the sub button and edit its label.
          </p>
        </div>
      </div>
    </>
  );
}
