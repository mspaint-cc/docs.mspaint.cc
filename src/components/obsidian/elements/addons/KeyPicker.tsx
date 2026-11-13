"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useElementValue } from "../../providers/UIStateProvider";
import { useHalfCornerRadius } from "../../providers/ObsidianDataProvider";

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
	const halfCornerRadius = useHalfCornerRadius();
	const [value, setValue] = useElementValue(stateKey, defaultValue);
	const [isListening, setIsListening] = useState(false);

	useEffect(() => {
		if (!isListening) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			event.preventDefault();
			event.stopPropagation();

			setValue(event.key.length === 1 ? event.key.toUpperCase() : event.key);
			setIsListening(false);
		};

		window.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => window.removeEventListener("keydown", handleKeyDown, true);
	}, [isListening, setValue]);

	const displayValue = modifiers && modifiers.length > 0 ? `${modifiers.join(" + ")} + ${value}` : value;

	return (
		<div
			className={cn(
				"group/keypicker inline-flex justify-center items-center h-[21px] outline outline-1 cursor-pointer select-none",
				"text-[14px] leading-none whitespace-nowrap",
				"bg-[var(--main-color)] outline-[var(--outline-color)] text-[var(--font-color)]",
				isListening ? "w-[29px]" : "px-[4.5px]",
				className
			)}
			style={{ borderRadius: halfCornerRadius }}
			onClick={(event) => {
				event.preventDefault();
				setIsListening(true);
			}}
			title={isListening ? "Press a key..." : mode ? `Mode: ${mode}` : undefined}
		>
			<span className="opacity-60 transition-opacity group-hover/keypicker:opacity-100">{isListening ? "..." : displayValue}</span>
		</div>
	);
}