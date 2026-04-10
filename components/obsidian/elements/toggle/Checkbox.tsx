"use client";

import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useUIValue } from "../../providers/UIStateProvider";
import Label from "../Label";
import { useCornerRadius } from "../../providers/ObsidianDataProvider";

export default function ToggleCheckbox({
  text,
  checked,
  risky,
  stateKey,
}: {
  text: string;
  checked: boolean;
  risky: boolean;
  stateKey?: string;
}) {
  const [externalChecked, setExternalChecked] = useUIValue<boolean | undefined>(
    stateKey,
    undefined
  );
  const [isChecked, setChecked] = useState<boolean>(
    (externalChecked as boolean | undefined) ?? checked
  );
  const br = useCornerRadius();

  useEffect(() => {
    if (!stateKey) return;
    const v = externalChecked;
    if (typeof v === "boolean") setChecked(v);
  }, [externalChecked, stateKey]);

  return (
    <div
      className="relative flex items-center gap-x-2 cursor-pointer group"
      onClick={(e) => {
        e.preventDefault();
        const next = !isChecked;
        setChecked(next);
        if (stateKey) setExternalChecked(next);
      }}
    >
      <button
        type="button"
        className="w-[20px] h-[20px] bg-[rgb(25,25,25)] group-hover:bg-[rgb(35,35,35)] border-[rgb(40,40,40)] border flex items-center justify-center shrink-0"
        style={{ borderRadius: br }}
      >
        <CheckIcon
          className={`w-[16px] h-[16px] transition-opacity stroke-white`}
          style={{ opacity: isChecked === true ? 1 : 0 }}
        />
      </button>

      <Label
        className={`text-left block text-xs select-none transition-opacity flex-1`}
        style={{
          opacity: isChecked === true ? 0.8 : 0.6,
          color: risky ? "var(--color-red-500)" : "var(--color-white)",
        }}
      >
        {text}
      </Label>
    </div>
  );
}