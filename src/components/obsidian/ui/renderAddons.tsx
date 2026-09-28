"use client";

import type { Addons, UIElement } from "../element.types";
import KeyPicker from "../elements/addons/KeyPicker";
import AddonContainer from "../elements/addons/AddonContainer";
import ColorPicker from "../elements/addons/ColorPicker";

export const renderAddons = (element: UIElement, addons?: Addons[], stateKeyPrefix?: string, node?: React.ReactNode) => {
	if (!addons || addons.length === 0) return null;

	const scope = stateKeyPrefix || "global";
	return (
		<AddonContainer>
			{addons.map((addon, idx) => {
				const addonKey = `${scope}:addon:${addon.type}:${element.index}:${idx}`;

				switch (addon.type) {
					case "KeyPicker":
						return (
							<KeyPicker
								key={idx}
								defaultValue={addon.displayValue || addon.value}
								mode={addon.mode}
								modifiers={addon.modifiers}
								className="pointer-events-auto"
								stateKey={addonKey}
							/>
						);

					case "ColorPicker":
						return (
							<ColorPicker
								key={idx}
								title={addon.title ?? null}
								defaultValue={addon.value}
								className="pointer-events-auto"
								stateKey={addonKey}
							/>
						);

					default:
						return null;
				}
			})}
			{node}
		</AddonContainer>
	);
};
