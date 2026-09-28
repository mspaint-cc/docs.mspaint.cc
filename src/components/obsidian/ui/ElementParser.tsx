"use client";

import { FC } from "react";
import type { Addons, UIElement } from "../element.types";
import Divider from "../elements/Divider";
import Toggle from "../elements/Toggle";
import Button from "../elements/Button";
import ObsidianImage from "../elements/Image";
import ObsidianVideo from "../elements/Video";
import ObsidianViewport from "../elements/Viewport";
import ObsidianUIPassthrough from "../elements/UIPassthrough";
import Label from "../elements/Label";
import Dropdown from "../elements/Dropdown";
import Input from "../elements/Input";
import Slider from "../elements/Slider";
import KeyBox from "../elements/KeyBox";
import ElementTooltip from "../elements/ElementTooltip";
import { renderAddons } from "./renderAddons";

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
				return <Label doesWrap={element.properties.doesWrap}>{element.text}</Label>;

			case "Button":
				return (
					<Button
						text={element.text}
						icon={element.icon ?? element.properties?.icon}
						subButton={
							element.subButton
								? {
										text: element.subButton.text,
										icon: element.subButton.icon ?? element.subButton.properties?.icon,
										properties: {
											risky: element.subButton.properties?.risky,
											doubleClick: element.subButton.properties?.doubleClick,
											icon: element.subButton.properties?.icon,
										},
									}
								: undefined
						}
						risky={element.properties?.risky}
						disabled={element.disabled}
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
						allowNull={element.properties.allowNull}
						specialType={element.properties.specialType}
						enablePlayerImages={element.properties.enablePlayerImages}
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
				return (
					<ObsidianImage
						image={element.properties.image}
						transparency={element.properties.transparency}
						scaleType={element.properties.scaleType}
						color={element.properties.color}
						rectOffset={element.properties.rectOffset}
						height={element.properties.height}
						rectSize={element.properties.rectSize}
					/>
				);

			case "Video":
				return <ObsidianVideo height={element.properties.height} />;

			case "Viewport":
				return (
					<ObsidianViewport
						height={element.properties.height}
						interactive={element.properties.interactive}
						autoFocus={element.properties.autoFocus}
					/>
				);

			case "UIPassthrough":
				return <ObsidianUIPassthrough height={element.properties.height} />;

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
