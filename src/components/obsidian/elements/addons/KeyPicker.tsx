"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useUIState } from "../../providers/UIStateProvider";
import { useCornerRadius } from "../../providers/ObsidianDataProvider";

export default function KeyPicker({
	defaultValue,
	className,
	stateKey,
	mode,
	modifiers
}: {
	defaultValue: string;
	className?: string;
	stateKey?: string;
	mode?: string;
	modifiers?: string[];
}) {
	const { state, setState } = useUIState();
	const br = useCornerRadius();

	const storedValue = useMemo(() => (stateKey ? (state[stateKey] as string | undefined) : undefined), [stateKey, state]);
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

	useEffect(() => {
		if (stateKey && storedValue !== undefined && storedValue !== value) {
			setValue(storedValue);
		}
	}, [stateKey, storedValue, value]);

	const display = modifiers && modifiers.length > 0 ? `${modifiers.join(" + ")} + ${value}` : value;

	return (
		<div
			className={cn(
				"inline-flex justify-center items-center border cursor-pointer select-none",
				"text-[12px] leading-none whitespace-nowrap",
				"opacity-40 hover:opacity-100 hover:brightness-125",
				isListening ? "w-[29px] h-[18px]" : "h-[18px] min-w-[18px] px-[4.5px]",
				className
			)}
			style={{
				borderRadius: `calc(${br} / 2)`,
				backgroundColor: "var(--main-color)",
				borderColor: "var(--outline-color)",
				color: "var(--font-color)"
			}}
			onClick={(e) => {
				e.preventDefault();
				setIsListening(true);
			}}
			title={isListening ? "Press a key..." : mode ? `Mode: ${mode}` : undefined}
		>
			{isListening ? "..." : display}
		</div>
	);
}
