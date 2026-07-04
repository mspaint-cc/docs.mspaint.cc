import { memo, useMemo, FC } from "react";

import { TabData, UIElement, Addons, TabboxData, GroupboxData } from "../element.types";
import { Groupbox } from "../elements/GroupBox";
import { TabContainer, TabLeft, TabRight } from "../elements/Tab";
import Divider from "../elements/Divider";
import Toggle from "../elements/Toggle";
import Button from "../elements/Button";
import ObsidianImage from "../elements/Image";
import ObsidianVideo from "../elements/Video";
import ObsidianViewport from "../elements/Viewport";
import ObsidianUIPassthrough from "../elements/UIPassthrough";
import Label from "../elements/Label";
import Tabbox from "../elements/TabBox";
import Dropdown from "../elements/Dropdown";
import Input from "../elements/Input";
import Slider from "../elements/Slider";
import KeyPicker from "../elements/addons/KeyPicker";
import AddonContainer from "../elements/addons/AddonContainer";
import ColorPicker from "../elements/addons/ColorPicker";
import ObsidianWarningBox from "../elements/WarningBox";

// Parsers //
export const renderAddons = (element: UIElement, addons?: Addons[], stateKeyPrefix?: string, node?: React.ReactNode) => {
	if (!addons || addons.length === 0) return null;

	const scope = stateKeyPrefix || "global";
	return (
		<AddonContainer>
			{addons.map((addon, idx) => {
				const addonKey = `${scope}:addon:${addon.type}:${element.index}:${idx}`;

				switch (addon.type) {
					case "KeyPicker":
						return <KeyPicker key={idx} defaultValue={addon.value} className="pointer-events-auto" stateKey={addonKey} />;

					case "ColorPicker":
						return (
							<ColorPicker
								key={idx}
								title={addon.title}
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
						subButton={element.subButton}
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
						disabledValues={element.properties.disabledValues || []}
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

			default:
				return (
					<div className="text-red-400 text-left">Unknown element type: {(element as { type: string }).type || "Unknown"}</div>
				);
		}
	})();

	return (
		<div className="relative">
			{core}
			{customHandlerForAddons == false && renderAddons(element, addons, stateKeyPrefix)}
		</div>
	);
};

const TabParserComponent: FC<{ tabData: TabData | null }> = ({ tabData }) => {
	const { groupboxes, tabboxes, warningBox } = tabData || {};

	const LeftBoxes = useMemo(() => {
		const GroupboxesList = groupboxes?.Left ? Object.values(groupboxes.Left) : [];
		const TabboxesList = tabboxes?.Left ? Object.values(tabboxes.Left) : [];
		return [...GroupboxesList, ...TabboxesList].sort((boxA, boxB) => (boxA.order ?? 0) - (boxB.order ?? 0));
	}, [groupboxes?.Left, tabboxes?.Left]);

	const RightBoxes = useMemo(() => {
		const GroupboxesList = groupboxes?.Right ? Object.values(groupboxes.Right) : [];
		const TabboxesList = tabboxes?.Right ? Object.values(tabboxes.Right) : [];
		return [...GroupboxesList, ...TabboxesList].sort((boxA, boxB) => (boxA.order ?? 0) - (boxB.order ?? 0));
	}, [groupboxes?.Right, tabboxes?.Right]);

	if (!tabData) return null;

	return (
		<>
			{warningBox && (
				<ObsidianWarningBox
					text={warningBox.Text}
					title={warningBox.Title}
					visible={warningBox.Visible}
					isNormal={warningBox.IsNormal}
					lockSize={warningBox.LockSize}
				/>
			)}

			<TabContainer>
				<TabLeft>
					{LeftBoxes.map((Box) => {
						if (Box.type === "Tabbox") {
							const TabboxInstance = Box as TabboxData;
							return <Tabbox key={TabboxInstance.name} tabs={TabboxInstance.tabs} scope={`tab:${tabData.name}:left:tabbox:${TabboxInstance.name}`} />;
						} else {
							const GroupboxInstance = Box as GroupboxData;
							return (
								<Groupbox
									key={GroupboxInstance.name}
									title={GroupboxInstance.name}
									collapsed={GroupboxInstance.collapsed}
									disableCollapsing={GroupboxInstance.disableCollapsing}
									icon={GroupboxInstance.icon}
								>
									{GroupboxInstance.elements.map((ElementInstance) => (
										<ElementParser
											key={`left-gb-${GroupboxInstance.name}-${ElementInstance.index}`}
											element={ElementInstance}
											stateKeyPrefix={`gb:${tabData.name}:left:groupbox:${GroupboxInstance.name}`}
										/>
									))}
								</Groupbox>
							);
						}
					})}
				</TabLeft>

				<TabRight>
					{RightBoxes.map((Box) => {
						if (Box.type === "Tabbox") {
							const TabboxInstance = Box as TabboxData;
							return (
								<Tabbox key={TabboxInstance.name} tabs={TabboxInstance.tabs} scope={`tab:${tabData.name}:right:tabbox:${TabboxInstance.name}`} />
							);
						} else {
							const GroupboxInstance = Box as GroupboxData;
							return (
								<Groupbox
									key={GroupboxInstance.name}
									title={GroupboxInstance.name}
									collapsed={GroupboxInstance.collapsed}
									disableCollapsing={GroupboxInstance.disableCollapsing}
									icon={GroupboxInstance.icon}
								>
									{GroupboxInstance.elements.map((ElementInstance) => (
										<ElementParser
											key={`right-gb-${GroupboxInstance.name}-${ElementInstance.index}`}
											element={ElementInstance}
											stateKeyPrefix={`gb:${tabData.name}:right:groupbox:${GroupboxInstance.name}`}
										/>
									))}
								</Groupbox>
							);
						}
					})}
				</TabRight>
			</TabContainer>
		</>
	);
};

TabParserComponent.displayName = "TabParser";
export const TabParser = memo(TabParserComponent);