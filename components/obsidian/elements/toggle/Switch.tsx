"use client";

import { useEffect, useState } from "react";
import { useUIValue } from "../../providers/UIStateProvider";
import Label from "../Label";
import { Addons, UIElement } from "../../element.types";
import { renderAddons } from "../../ui/DynamicTab";

function Switch({
  isChecked,
  onClick,
}: {
  isChecked: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="relative flex items-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      <div
        className="relative w-[32px] h-[20px] rounded-full border transition-colors shrink-0"
        style={{
          backgroundColor: isChecked ? "rgb(125, 85, 255)" : "rgb(25, 25, 25)",
          borderColor: isChecked ? "rgb(125, 85, 255)" : "rgb(40, 40, 40)",
        }}
      >
        <div
          className="absolute top-[2px] w-[13px] h-[13px] rounded-full bg-white transition-all"
          style={{
            left: isChecked ? "calc(100% - 15px)" : "3px",
          }}
        />
      </div>
    </div>
  );
}

export default function ToggleSwitch({
  text,
  checked,
  risky,
  stateKey,
  addonData,
}: {
  text: string;
  checked: boolean;
  risky: boolean;
  stateKey?: string;
  addonData?: [UIElement, Addons[] | undefined, string | undefined];
}) {
  const [externalChecked, setExternalChecked] = useUIValue<boolean | undefined>(
    stateKey,
    undefined
  );
  const [isChecked, setChecked] = useState<boolean>(
    (externalChecked as boolean | undefined) ?? checked
  );
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = !isChecked;

    setChecked(next);
    if (stateKey) setExternalChecked(next);
  };

  useEffect(() => {
    if (!stateKey) return;
    if (typeof externalChecked === "boolean") setChecked(externalChecked);
  }, [externalChecked, stateKey]);

  const uiElement = addonData && addonData[0];
  const addons = addonData && addonData[1];
  const stateKeyPrefix = addonData && addonData[2];

  return (<div>
    <div
      className="relative flex items-center gap-2 cursor-pointer"
      onClick={toggle}
    >
      <Label
        className={`text-left block text-xs select-none transition-opacity flex-1`}
        style={{
          opacity: isChecked ? 1 : 0.6,
          color: risky ? "var(--color-red-500)" : "var(--color-white)",
        }}
      >
        {text}
      </Label>

      {addons && addons.length === 0 && <Switch isChecked={isChecked} onClick={toggle} />}
    </div>

    {addons && uiElement && addons.length > 0 && renderAddons(uiElement as UIElement, addons, stateKeyPrefix, <Switch isChecked={isChecked} onClick={toggle} />)}
  </div>);
}