"use client";

import { cn } from "@/lib/utils";
import type { Addons, UIElement } from "../element.types";
import KeyPicker from "../elements/addons/KeyPicker";
import AddonContainer from "../elements/addons/AddonContainer";
import ColorPicker from "../elements/addons/ColorPicker";

export const renderAddonItems = (index: string | number, addons?: Addons[], stateKeyPrefix?: string, className?: string) => {
	if (!addons || addons.length === 0) return null;

	const scope = stateKeyPrefix || "global";
	return addons.map((addon, addonIndex) => {
		const addonKey = `${scope}:addon:${addon.type}:${index}:${addonIndex}`;

		switch (addon.type) {
			case "KeyPicker":
				return (
					<KeyPicker
						key={addonIndex}
						defaultValue={addon.displayValue || addon.value}
						mode={addon.mode}
						modifiers={addon.modifiers}
						className={cn("pointer-events-auto", className)}
						stateKey={addonKey}
					/>
				);

			case "ColorPicker":
				return (
					<ColorPicker
						key={addonIndex}
						title={addon.title ?? null}
						defaultValue={addon.value}
						className="pointer-events-auto"
						stateKey={addonKey}
					/>
				);

			default:
				return null;
		}
	});
};

export const renderAddons = (element: UIElement, addons?: Addons[], stateKeyPrefix?: string, node?: React.ReactNode) => {
	if (!addons || addons.length === 0) return null;

	return (
		<AddonContainer>
			{renderAddonItems(element.index, addons, stateKeyPrefix)}
			{node}
		</AddonContainer>
	);
};