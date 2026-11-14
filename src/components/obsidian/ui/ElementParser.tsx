"use client";

import { FC } from "react";
import type { Addons, UIElement } from "../element.types";
import Divider from "../elements/Divider";
import Toggle from "../elements/Toggle";
import Button from "../elements/Button";
import Placeholder from "../elements/Placeholder";
import ObsidianViewport from "../elements/Viewport";
import Label from "../elements/Label";
import Dropdown from "../elements/Dropdown";
import Input from "../elements/Input";
import Slider from "../elements/Slider";
import KeyBox from "../elements/KeyBox";
import ElementTooltip from "../elements/ElementTooltip";
import { renderAddons } from "./renderAddons";
import { getRobloxLetterSpacing } from "../fonts";

export const ElementParser: FC<{
	element: UIElement;
	stateKeyPrefix?: string;
}> = ({ element, stateKeyPrefix }) => {
	if ("visible" in element && !element.visible) return null;

	const scope = stateKeyPrefix || "global";
	const addons = (element as unknown as { properties?: { addons?: Addons[] } }).properties?.addons;
	let customHandlerForAddons = false;

	const core = (() => {
		switch (element.type) {
			case "Toggle":
				customHandlerForAddons = element.properties.variant === undefined || element.properties.variant === "Switch";
				return (
					<Toggle
						text={element.text}
						risky={element.properties.risky}
						checked={element.value}
						variant={element.properties.variant}
						stateKey={`${scope}:el:Toggle:${element.index}`}
						addonData={[element, addons, stateKeyPrefix]}
					/>
				);

			case "Label":
				return (
					<Label
						doesWrap={element.properties.doesWrap}
						className={element.properties.doesWrap ? "py-[2px]" : "leading-[18px] min-h-[18px]"}
						style={element.properties.size ? { fontSize: `${element.properties.size}px`, letterSpacing: getRobloxLetterSpacing(element.properties.size) } : undefined}
					>
						{element.text}
					</Label>
				);

			case "Button":
				customHandlerForAddons = true;
				return (
					<Button
						text={element.text}
						icon={element.icon ?? element.properties?.icon}
						subButton={element.subButton}
						risky={element.properties?.risky}
						disabled={element.disabled}
						addons={addons}
						index={element.index}
						stateKeyPrefix={stateKeyPrefix}
					/>
				);

			case "Dropdown":
				return (
					<Dropdown
						text={element.text}
						value={element.value}
						options={element.properties.values}
						multi={element.properties.multi === true}
						searchable={element.properties.searchable === true}
						disabledValues={element.properties.disabledValues}
						valueImages={element.properties.valueImages}
						listLabels={element.properties.listLabels}
						displayLabels={element.properties.displayLabels}
						allowNull={element.properties.allowNull}
						specialType={element.properties.specialType}
						enablePlayerImages={element.properties.enablePlayerImages}
						displayText={element.properties.displayText}
						autoWidth={element.properties.autoWidth}
						keepDisabledValuePosition={element.properties.keepDisabledValuePosition}
						stateKey={`${scope}:el:Dropdown:${element.index}`}
					/>
				);

			case "Slider":
				return (
					<Slider
						text={element.text}
						value={element.value}
						min={element.properties.min}
						max={element.properties.max}
						compact={element.properties.compact}
						hideMax={element.properties.hideMax}
						rounding={element.properties.rounding}
						prefix={element.properties.prefix}
						suffix={element.properties.suffix}
						stateKey={`${scope}:el:Slider:${element.index}`}
					/>
				);

			case "Input":
				return (
					<Input
						text={element.text}
						value={element.value}
						placeholder={element.properties.placeholder}
						maxLength={element.properties.maxLength}
						clearTextOnFocus={element.properties.clearTextOnFocus}
						stateKey={`${scope}:el:Input:${element.index}`}
					/>
				);

			case "Divider":
				return (
					<Divider
						text={element.properties?.text}
						marginTop={element.properties?.marginTop}
						marginBottom={element.properties?.marginBottom}
					/>
				);

			case "Image":
				return <Placeholder height={element.properties.height} />;

			case "Video":
				return <Placeholder height={element.properties.height ?? 200} />;

			case "Viewport":
				return (
					<ObsidianViewport
						height={element.properties.height}
						interactive={element.properties.interactive}
						autoFocus={element.properties.autoFocus}
					/>
				);

			case "UIPassthrough":
				return <Placeholder height={element.properties.height ?? 24} />;

			case "KeyBox":
				return (
					<KeyBox
						placeholder={element.properties.placeholder}
						value={typeof element.value === "string" ? element.value : ""}
						stateKey={`${scope}:el:KeyBox:${element.index}`}
					/>
				);

			default:
				return (
					<div className="text-red-400 text-left">Unknown element type: {(element as { type: string }).type || "Unknown"}</div>
				);
		}
	})();

	return (
		<ElementTooltip tooltip={element.tooltip} disabledTooltip={element.disabledTooltip} disabled={element.disabled}>
			<div className="relative">
				{core}
				{customHandlerForAddons == false && renderAddons(element, addons, stateKeyPrefix)}
			</div>
		</ElementTooltip>
	);
};