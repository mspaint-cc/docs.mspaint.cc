"use client";

import { Groupbox } from "../obsidian/elements/GroupBox";
import Label from "../obsidian/elements/Label";
import { UIStateProvider } from "../obsidian/UIStateProvider";

export default function DemoGroupbox() {
  return (
    <div className="max-w-[720px] max-h-[250px]">
      <div className="flex flex-col gap-4 border rounded-lg p-4 h-[250px] my-auto items-center">
        <div className="w-[50%] max-sm:w-[90%] max-md:w-[80%] max-lg:w-[60%]">
          <UIStateProvider>
            <Groupbox title="Player Info">
              <Label>
                {
                  '[<font color="rgb(73, 230, 133)">Current Player</font>]: Roblox (ID: 1)'
                }
              </Label>
              <Label>
                {'[<font color="rgb(73, 230, 133)">Level</font>]: 100'}
              </Label>
            </Groupbox>
          </UIStateProvider>
        </div>
      </div>
    </div>
  );
}
