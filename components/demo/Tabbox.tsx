"use client";

import Tabbox from "../obsidian/elements/TabBox";
import { UIStateProvider } from "../obsidian/UIStateProvider";

export default function DemoTabbox() {
  return (
    <div className="max-w-[720px] max-h-[250px]">
      <div className="flex flex-col gap-4 border rounded-lg p-4 h-[250px] my-auto items-center">
        <div className="w-[50%] max-sm:w-[90%] max-md:w-[80%] max-lg:w-[60%]">
          <UIStateProvider>
            <Tabbox
              tabs={{
                ["Auto Farm"]: {
                  type: "Tab",
                  name: "Auto Farm",
                  order: 0,
                  elements: [
                    {
                      type: "Toggle",
                      text: "Enable Auto Farm",
                      value: false,
                      index: 0,
                      visible: true,
                      disabled: false,
                      properties: {
                        risky: false,
                        addons: undefined,
                      },
                    },
                  ],
                },
                Settings: {
                  type: "Tab",
                  name: "Settings",
                  order: 1,
                  elements: [
                    {
                      type: "Dropdown",
                      text: "Mode",
                      value: "Blatant",
                      index: 0,
                      visible: true,
                      disabled: false,
                      properties: {
                        values: ["Blatant", "Legit"],
                        disabledValues: [],
                        multi: false,
                      },
                    },

                    {
                      type: "Divider",
                      text: "",
                      index: 1,
                      visible: true,
                      disabled: false,
                      properties: {},
                    },

                    {
                      type: "Button",
                      text: "Reset to Default",
                      index: 2,
                      visible: true,
                      disabled: false,
                    },
                  ],
                },
              }}
              scope={`demo:tab`}
            />
          </UIStateProvider>
        </div>
      </div>
    </div>
  );
}
