"use client";

import { useHalfCornerRadius } from "../providers/ObsidianDataProvider";
import { useElementValue } from "../providers/UIStateProvider";
import { cn } from "@/lib/utils";

const keyBoxPartClassName = "box-border h-full text-[14px] border bg-[var(--main-color)] border-[var(--outline-color)] text-[var(--font-color)] outline-none";

export default function KeyBox({
	placeholder = "Key",
	value = "",
	stateKey
}: {
	placeholder?: string;
	value?: string;
	stateKey?: string;
}) {
	const halfCornerRadius = useHalfCornerRadius();
	const [currentValue, setCurrentValue] = useElementValue(stateKey, value);

	return (
		<div className="w-[75%] mx-auto flex flex-row h-[21px]">
			<input
				type="text"
				value={currentValue}
				placeholder={placeholder}
				className={cn(keyBoxPartClassName, "flex-1 min-w-0 px-[8px] !text-left placeholder:text-[color-mix(in_srgb,var(--font-color)_50%,black)] focus:border-[var(--accent-color)] transition-colors")}
				style={{ borderRadius: halfCornerRadius }}
				onChange={(event) => setCurrentValue(event.target.value)}
			/>

			<button type="button" className={cn(keyBoxPartClassName, "group/keybox ml-[8px] w-[63px] shrink-0 cursor-pointer")} style={{ borderRadius: halfCornerRadius }}>
				<span className="opacity-60 group-hover/keybox:opacity-100 transition-opacity">Execute</span>
			</button>
		</div>
	);
}