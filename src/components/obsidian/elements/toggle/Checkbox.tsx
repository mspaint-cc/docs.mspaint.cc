"use client";

import { CheckIcon } from "lucide-react";
import { useElementValue } from "../../providers/UIStateProvider";
import Label from "../Label";
import { useHalfCornerRadius } from "../../providers/ObsidianDataProvider";

export default function ToggleCheckbox({
	text,
	checked,
	risky,
	stateKey
}: {
	text: string;
	checked: boolean;
	risky: boolean;
	stateKey?: string;
}) {
	const [isChecked, setChecked] = useElementValue(stateKey, checked);
	const halfCornerRadius = useHalfCornerRadius();

	return (
		<div
			className="relative flex items-center h-[18px] gap-x-[7px] cursor-pointer"
			onClick={(event) => {
				event.preventDefault();
				setChecked(!isChecked);
			}}
		>
			<button
				type="button"
				className="size-[20px] -my-[1px] border flex items-center justify-center shrink-0 bg-[var(--main-color)] border-[var(--outline-color)]"
				style={{ borderRadius: halfCornerRadius }}
			>
				<CheckIcon className="size-[14px] transition-opacity stroke-[var(--font-color)]" style={{ opacity: isChecked ? 1 : 0 }} />
			</button>

			<Label
				className="text-left block text-[14px] leading-[18px] select-none transition-opacity flex-1"
				style={{
					opacity: isChecked ? 1 : 0.6,
					color: risky ? "var(--color-red-500)" : "var(--font-color)"
				}}
			>
				{text}
			</Label>
		</div>
	);
}