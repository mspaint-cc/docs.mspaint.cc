"use client";

import { cn } from "@/lib/utils";
import Label from "../Label";
import { useEffect, useState, useMemo } from "react";
import { useUIState } from "../../UIStateProvider";

export default function KeyPicker({
  defaultValue,
  className,
  stateKey,
}: {
  defaultValue: string;
  className?: string;
  stateKey?: string;
}) {
  const { state, setState } = useUIState();

  const storedValue = useMemo(
    () => (stateKey ? (state[stateKey] as string | undefined) : undefined),
    [stateKey, state]
  );
  const [value, setValue] = useState<string>(storedValue ?? defaultValue);
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    if (!isListening) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const key = e.key;
      const cleaned = key.length === 1 ? key.toUpperCase() : key;

      setValue(cleaned);
      if (stateKey) setState(stateKey, cleaned);
      setIsListening(false);
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isListening, stateKey, setState]);

  // Sync with UI state when stored value changes //
  useEffect(() => {
    if (stateKey && storedValue !== undefined && storedValue !== value) {
      setValue(storedValue);
    }
  }, [stateKey, storedValue, value]);

  return (
    <div
      className={cn(
        "flex justify-center items-center h-[22px] bg-[rgb(25,25,25)] hover:bg-[rgb(35,35,35)] border-[rgb(40,40,40)] border",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        setIsListening(true);
      }}
      title={isListening ? "Press a key..." : undefined}
    >
      <Label className="m-1 text-[12px] text-white">
        {isListening ? "..." : value}
      </Label>
    </div>
  );
}
