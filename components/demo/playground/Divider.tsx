"use client";

import Divider from "@/components/obsidian/elements/Divider";
import { CopyPseudoComponent } from "./shared/CopyComponent";
import Button from "@/components/obsidian/elements/Button";
import { UIStateProvider } from "@/components/obsidian/UIStateProvider";
import Toggle from "@/components/obsidian/elements/Toggle";

export default function DividerPlayground() {
  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[250px] relative">
      <CopyPseudoComponent codegenfunc={() => "Groupbox:AddDivider()"} />

      <div className="flex items-center justify-center min-h-[150px] relative">
        <div className="w-[50%] max-sm:w-[90%] max-md:w-[80%] max-lg:w-[60%] flex flex-col gap-2 mx-auto">
          <UIStateProvider>
            <Toggle text="Create Logs" checked={false} risky={false} />
            <Divider />
            <Button text="Join Discord" subButton={{ text: "Copy Link" }} />
            <Button text="Unload" />
          </UIStateProvider>
        </div>
      </div>
    </div>
  );
}
