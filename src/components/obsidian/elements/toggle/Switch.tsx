"use client";

import { cn } from "@/lib/utils";
import { useElementValue } from "../../providers/UIStateProvider";
import Label from "../Label";
import { Addons, UIElement } from "../../element.types";
import { renderAddons } from "../../ui/renderAddons";

function Switch({ isChecked, onClick }: { isChecked: boolean; onClick: (event: React.MouseEvent) => void }) {
	return (
		<div className="relative flex items-center cursor-pointer" onClick={onClick}>
			<div
				className={cn(
					"relative w-[34px] h-[20px] rounded-full border transition-colors shrink-0 -my-[1px]",
					isChecked ? "bg-[var(--accent-color)] border-[var(--accent-color)]" : "bg-[var(--main-color)] border-[var(--outline-color)]"
				)}
			>
				<div
					className="absolute top-[2px] size-[14px] rounded-full transition-all bg-[var(--font-color)]"
					style={{ left: isChecked ? "calc(100% - 16px)" : "2px" }}
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
	addonData
}: {
	text: string;
	checked: boolean;
	risky: boolean;
	stateKey?: string;
	addonData?: [UIElement, Addons[] | undefined, string | undefined];
}) {
	const [isChecked, setChecked] = useElementValue(stateKey, checked);
	const toggle = (event: React.MouseEvent) => {
		event.preventDefault();
		setChecked(!isChecked);
	};

	const [uiElement, addons, stateKeyPrefix] = addonData ?? [];
	const hasAddons = !!uiElement && !!addons && addons.length > 0;
	const switchElement = <Switch isChecked={isChecked} onClick={toggle} />;

	return (
		<div className="relative">
			<div className="relative flex items-center h-[18px] gap-2 cursor-pointer" onClick={toggle}>
				<Label
					className="text-left block text-[14px] leading-[18px] select-none transition-opacity flex-1"
					style={{
						opacity: isChecked ? 1 : 0.6,
						color: risky ? "var(--color-red-500)" : "var(--font-color)"
					}}
				>
					{text}
				</Label>

				{!hasAddons && switchElement}
			</div>

			{hasAddons && renderAddons(uiElement, addons, stateKeyPrefix, switchElement)}
		</div>
	);
}