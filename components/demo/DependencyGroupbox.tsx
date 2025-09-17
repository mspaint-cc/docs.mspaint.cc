"use client";

import { useMemo } from "react";
import { Groupbox } from "../obsidian/elements/GroupBox";
import Toggle from "../obsidian/elements/Toggle";
import { UIStateProvider, useUIValue } from "../obsidian/UIStateProvider";
import Slider from "../obsidian/elements/Slider";

function ObsidianComponent() {
  const [externalChecked] = useUIValue<boolean | undefined>(
    "demo:audio",
    undefined
  );

  return (
    <>
      <Groupbox title="Audio Settings">
        <Toggle
          text="Enable Audio"
          checked={false}
          risky={false}
          stateKey="demo:audio"
        />
      </Groupbox>

      {externalChecked === true && (
        <Groupbox>
          <Slider text="Volume" value={50} min={0} max={100} rounding={0} />
        </Groupbox>
      )}
    </>
  );
}

export default function DemoDependencyBox() {
  const memoizedComponent = useMemo(
    () => (
      <UIStateProvider>
        <ObsidianComponent />
      </UIStateProvider>
    ),
    []
  );

  return (
    <div className="max-w-[720px] max-h-[250px]">
      <div className="flex flex-col gap-4 border rounded-lg p-4 h-[250px] my-auto items-center">
        <div className="w-[50%] max-sm:w-[90%] max-md:w-[80%] max-lg:w-[60%]">
          {memoizedComponent}
        </div>
      </div>
    </div>
  );
}
