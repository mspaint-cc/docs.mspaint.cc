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
	stateKey
}: {
	text: string;
	checked: boolean;
	risky: boolean;
	stateKey?: string;
}) {
	const [externalChecked, setExternalChecked] = useUIValue<boolean | undefined>(stateKey, undefined);
	const [isChecked, setChecked] = useState<boolean>((externalChecked as boolean | undefined) ?? checked);
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
				className="size-[20px] border flex items-center justify-center shrink-0 hover:brightness-125"
				style={{
					borderRadius: br,
					backgroundColor: "var(--main-color)",
					borderColor: "var(--outline-color)"
				}}
			>
				<CheckIcon className={`size-[16px] transition-opacity`} style={{ opacity: isChecked === true ? 1 : 0, stroke: "var(--font-color)" }} />
			</button>

			<Label
				className={`text-left block text-xs select-none transition-opacity flex-1`}
				style={{
					opacity: isChecked === true ? 0.8 : 0.6,
					color: risky ? "var(--color-red-500)" : "var(--font-color)"
				}}
			>
				{text}
			</Label>
		</div>
	);
}
