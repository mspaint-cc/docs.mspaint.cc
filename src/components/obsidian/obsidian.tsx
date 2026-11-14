"use client";

import React from "react";
import type { ReactNode } from "react";

import type { UIData, TabData, GroupboxData, UIElement, Color3, Vector2, TabboxData, DropdownDividerValue } from "./element.types";
import { UIStateProvider } from "./providers/UIStateProvider";
import { ObsidianWindow } from "./Window";

type ObsidianWrapperProps = {
	title: ReactNode | string;
	icon?: ReactNode | string;
	footer: ReactNode | string;
	uiData?: unknown;
	children?: ReactNode;
	width?: number | string;
	height?: number | string;
};

export type ObsidianTabProps = {
	name: string;
	order?: number;
	icon?: string;
	description?: string;
	tooltip?: string;
	isKeyTab?: boolean;
	children?: ReactNode;
};

export type ObsidianSubTabProps = {
	name: string;
	order?: number;
	icon?: string;
	children?: ReactNode;
};

export type ObsidianSideProps = { children?: ReactNode };

export type ObsidianGroupboxProps = {
	name: string;
	order?: number;
	icon?: string;
	description?: string;
	collapsed?: boolean;
	disableCollapsing?: boolean;
	children?: ReactNode;
};

type BaseElementProps = { visible?: boolean; disabled?: boolean };

export type OToggleProps = BaseElementProps & {
	text: string;
	defaultChecked?: boolean;
	risky?: boolean;
	variant?: "Switch" | "Checkbox";
};

export type OLabelProps = BaseElementProps & {
	text: string;
	doesWrap?: boolean;
};

export type OButtonProps = BaseElementProps & {
	text: string;
	icon?: string;
	risky?: boolean;
	subButtonText?: string;
	subButtonIcon?: string;
	subButtonRisky?: boolean;
};

export type ODropdownProps = BaseElementProps & {
	text: string;
	value?: string | { [key: string]: boolean };
	options: (string | DropdownDividerValue)[] | { [key: string]: string };
	displayText?: string;
	autoWidth?: boolean;
	keepDisabledValuePosition?: boolean;
	disabledValues?: string[];
	valueImages?: { [key: string]: string };
	listLabels?: { [key: string]: string };
	displayLabels?: { [key: string]: string };
	multi?: boolean;
	searchable?: boolean;
	allowNull?: boolean;
	specialType?: string;
	enablePlayerImages?: boolean;
};

export type OSliderProps = BaseElementProps & {
	text: string;
	value?: number;
	min?: number;
	max?: number;
	compact?: boolean;
	hideMax?: boolean;
	rounding?: number;
	prefix?: string;
	suffix?: string;
};

export type OInputProps = BaseElementProps & {
	text: string;
	value?: string;
	placeholder?: string;
	maxLength?: number;
	clearTextOnFocus?: boolean;
};

export type ODividerProps = BaseElementProps & {
	text?: string;
	marginTop?: number;
	marginBottom?: number;
};

export type OVideoProps = BaseElementProps & { height?: number };

export type OViewportProps = BaseElementProps & { height?: number };

export type OUIPassthroughProps = BaseElementProps & { height?: number };

export type OKeyBoxProps = BaseElementProps & {
	placeholder?: string;
	value?: string;
};

export type OImageProps = BaseElementProps & {
	text?: string;
	image: string;
	color?: Color3;
	rectOffset?: Vector2;
	rectSize?: Vector2;
	height?: number;
	scaleType?: string;
	transparency?: number;
};

export type TabWarningProps = {
	visible?: boolean;
	title?: string;
	text?: string;
	isNormal?: boolean;
	lockSize?: boolean;
};

const Tags = {
	Tab: "obsidian-tab",
	SubTab: "obsidian-subtab",
	Left: "obsidian-left",
	Right: "obsidian-right",
	Groupbox: "obsidian-groupbox",
	Toggle: "obsidian-toggle",
	Label: "obsidian-label",
	Button: "obsidian-button",
	Dropdown: "obsidian-dropdown",
	Slider: "obsidian-slider",
	Input: "obsidian-input",
	Divider: "obsidian-divider",
	Image: "obsidian-image",
	Video: "obsidian-video",
	Viewport: "obsidian-viewport",
	UIPassthrough: "obsidian-uipassthrough",
	KeyBox: "obsidian-keybox",
	TabWarning: "obsidian-tabwarning"
} as const;

type TagName = keyof typeof Tags;

const makeMarker = <P extends object>(displayName: string) => {
	const Marker: React.FC<P> = () => null;
	Marker.displayName = displayName;
	return Marker;
};

export const ObsidianTab = makeMarker<ObsidianTabProps>("ObsidianTab");
export const ObsidianSubTab = makeMarker<ObsidianSubTabProps>("ObsidianSubTab");
export const ObsidianLeft = makeMarker<ObsidianSideProps>("ObsidianLeft");
export const ObsidianRight = makeMarker<ObsidianSideProps>("ObsidianRight");
export const ObsidianGroupbox = makeMarker<ObsidianGroupboxProps>("ObsidianGroupbox");

export const OToggle = makeMarker<OToggleProps>("OToggle");
export const OLabel = makeMarker<OLabelProps>("OLabel");
export const OButton = makeMarker<OButtonProps>("OButton");
export const ODropdown = makeMarker<ODropdownProps>("ODropdown");
export const OSlider = makeMarker<OSliderProps>("OSlider");
export const OInput = makeMarker<OInputProps>("OInput");
export const ODivider = makeMarker<ODividerProps>("ODivider");
export const OImage = makeMarker<OImageProps>("OImage");
export const OVideo = makeMarker<OVideoProps>("OVideo");
export const OViewport = makeMarker<OViewportProps>("OViewport");
export const OUIPassthrough = makeMarker<OUIPassthroughProps>("OUIPassthrough");
export const OKeyBox = makeMarker<OKeyBoxProps>("OKeyBox");
export const TabWarning = makeMarker<TabWarningProps>("TabWarning");

export { OLabel as ObsidianLabel };
export { OToggle as ObsidianToggle };
export { OButton as ObsidianButton };
export { ODropdown as ObsidianDropdown };
export { OSlider as ObsidianSlider };
export { OInput as ObsidianInput };
export { ODivider as ObsidianDivider };
export { OImage as ObsidianImage };
export { OVideo as ObsidianVideo };
export { OViewport as ObsidianViewport };
export { OUIPassthrough as ObsidianUIPassthrough };
export { OKeyBox as ObsidianKeyBox };
export { TabWarning as ObsidianTabWarning };
export { ObsidianSubTab as OSubTab };

export const DropdownDivider = (title?: string): DropdownDividerValue => ({ DropdownDivider: true, Title: title });

const MarkerProperty = "__obsidianType";

type NameLike = {
	displayName?: string;
	name?: string;
	_name?: string;
	render?: { displayName?: string; name?: string };
	$$id?: unknown;
};

const getTypeName = (type: unknown) => {
	const named = type as NameLike | undefined;
	const clientReferenceId = typeof named?.$$id === "string" ? named.$$id : undefined;
	const clientExportName = clientReferenceId && clientReferenceId.includes("#") ? clientReferenceId.slice(clientReferenceId.lastIndexOf("#") + 1) : undefined;

	return named?.displayName || named?.name || named?._name || named?.render?.displayName || named?.render?.name || clientExportName;
};

const isElementOfType = (node: ReactNode, component: React.ComponentType<never>) => {
	if (!React.isValidElement(node)) return false;
	if (node.type === component) return true;

	const nodeName = getTypeName(node.type);
	const componentName = getTypeName(component);
	if (!nodeName || !componentName) return false;

	return nodeName.replace(/\./g, "") === componentName.replace(/\./g, "");
};

const matchesElement = (node: ReactNode, component: React.ComponentType<never>, name: TagName): node is React.ReactElement => {
	if (!node || typeof node !== "object") return false;
	if (isElementOfType(node, component)) return true;

	const element = node as { type?: unknown; props?: Record<string, unknown> };
	return element.type === Tags[name] || element.props?.[MarkerProperty] === name;
};

const createBaseElement = (props: BaseElementProps, type: string, text: string, elementIndex: number) => ({
	index: elementIndex,
	visible: props.visible ?? true,
	type,
	text,
	disabled: props.disabled ?? false
});

type ElementParserEntry = {
	component: React.ComponentType<never>;
	name: TagName;
	text: (props: never) => string;
	build: (props: never) => Record<string, unknown>;
};

const defineEntry = <P,>(component: React.ComponentType<P>, name: TagName, text: (props: P) => string, build: (props: P) => Record<string, unknown>) =>
	({ component, name, text, build }) as unknown as ElementParserEntry;

const getDefaultDropdownValue = (props: ODropdownProps) => {
	if (props.multi) return {};
	if (Array.isArray(props.options)) return props.options?.[0] ?? "";
	return Object.keys(props.options || {})[0] ?? "";
};

const ElementParsers: ElementParserEntry[] = [
	defineEntry(OToggle, "Toggle", (props) => props.text, (props) => ({
		value: props.defaultChecked ?? false,
		properties: { risky: props.risky ?? false, variant: props.variant ?? "Switch" }
	})),
	defineEntry(OLabel, "Label", (props) => props.text, (props) => ({
		properties: { doesWrap: props.doesWrap ?? false }
	})),
	defineEntry(OButton, "Button", (props) => props.text, (props) => ({
		icon: props.icon,
		properties: { risky: props.risky ?? false, doubleClick: false, icon: props.icon },
		subButton: props.subButtonText
			? { text: props.subButtonText, icon: props.subButtonIcon, properties: { risky: props.subButtonRisky, icon: props.subButtonIcon } }
			: undefined
	})),
	defineEntry(ODropdown, "Dropdown", (props) => props.text, (props) => ({
		value: props.value ?? getDefaultDropdownValue(props),
		properties: {
			values: props.options ?? [],
			displayText: props.displayText,
			autoWidth: props.autoWidth,
			keepDisabledValuePosition: props.keepDisabledValuePosition,
			disabledValues: props.disabledValues ?? [],
			valueImages: props.valueImages,
			listLabels: props.listLabels,
			displayLabels: props.displayLabels,
			multi: props.multi ?? false,
			searchable: props.searchable ?? false,
			allowNull: props.allowNull,
			specialType: props.specialType,
			enablePlayerImages: props.enablePlayerImages
		}
	})),
	defineEntry(OSlider, "Slider", (props) => props.text, (props) => ({
		value: props.value ?? props.min ?? 0,
		properties: {
			min: props.min ?? 0,
			max: props.max ?? 100,
			compact: props.compact,
			hideMax: props.hideMax,
			rounding: props.rounding,
			prefix: props.prefix ?? "",
			suffix: props.suffix ?? ""
		}
	})),
	defineEntry(OInput, "Input", (props) => props.text, (props) => ({
		value: props.value ?? "",
		properties: {
			placeholder: props.placeholder ?? "",
			finished: false,
			emptyReset: "",
			numeric: false,
			clearTextOnFocus: props.clearTextOnFocus ?? false,
			allowEmpty: true,
			maxLength: props.maxLength
		}
	})),
	defineEntry(ODivider, "Divider", () => "", (props) => ({
		properties: { text: props.text, marginTop: props.marginTop ?? 0, marginBottom: props.marginBottom ?? 0 }
	})),
	defineEntry(OImage, "Image", (props) => props.text ?? "", (props) => ({
		properties: {
			image: props.image,
			color: props.color ?? { r: 255, g: 255, b: 255 },
			rectOffset: props.rectOffset ?? { x: 0, y: 0 },
			rectSize: props.rectSize ?? { x: 0, y: 0 },
			height: props.height ?? 30,
			scaleType: props.scaleType ?? "Fit",
			transparency: props.transparency ?? 1
		}
	})),
	defineEntry(OVideo, "Video", () => "", (props) => ({
		properties: { video: "", looped: false, playing: false, volume: 1, height: props.height ?? 200 }
	})),
	defineEntry(OViewport, "Viewport", () => "", (props) => ({
		properties: { height: props.height ?? 200, interactive: false, autoFocus: true }
	})),
	defineEntry(OUIPassthrough, "UIPassthrough", () => "", (props) => ({
		properties: { height: props.height ?? 24 }
	})),
	defineEntry(OKeyBox, "KeyBox", (props) => props.placeholder ?? "Key", (props) => ({
		value: props.value ?? "",
		properties: { placeholder: props.placeholder ?? "Key" }
	}))
];

function parseElements(children: ReactNode, startIndex = 0): { elements: UIElement[]; lastIndex: number } {
	const elements: UIElement[] = [];
	let elementIndex = startIndex;

	React.Children.forEach(children, (child) => {
		const parser = ElementParsers.find((entry) => matchesElement(child, entry.component, entry.name));
		if (!parser || !React.isValidElement(child)) return;

		const props = child.props as never;
		elements.push({ ...createBaseElement(props, parser.name, parser.text(props), elementIndex++), ...parser.build(props) } as unknown as UIElement);
	});

	return { elements, lastIndex: elementIndex };
}

function parseGroupboxes(children: ReactNode): { [key: string]: GroupboxData } {
	const groupboxes: { [key: string]: GroupboxData } = {};
	let globalIndex = 0;

	React.Children.forEach(children, (child) => {
		if (!matchesElement(child, ObsidianGroupbox, "Groupbox")) return;

		const props = child.props as ObsidianGroupboxProps;
		groupboxes[props.name] = {
			type: "Groupbox",
			name: props.name,
			order: props.order ?? 0,
			side: "Unknown",
			icon: props.icon,
			description: props.description,
			collapsed: props.collapsed,
			disableCollapsing: props.disableCollapsing,
			elements: parseElements(props.children, 0).elements.map((element) => ({ ...element, index: globalIndex++ }))
		};
	});

	return groupboxes;
}

function parseTabContent(children: ReactNode): Pick<TabData, "groupboxes" | "tabboxes" | "warningBox"> {
	const childList = React.Children.toArray(children);
	const leftNode = childList.find((child) => matchesElement(child, ObsidianLeft, "Left")) as React.ReactElement<ObsidianSideProps> | undefined;
	const rightNode = childList.find((child) => matchesElement(child, ObsidianRight, "Right")) as React.ReactElement<ObsidianSideProps> | undefined;
	const warningNode = childList.find((child) => matchesElement(child, TabWarning, "TabWarning")) as React.ReactElement<TabWarningProps> | undefined;
	const warningProps = warningNode?.props;

	return {
		tabboxes: { Left: [], Right: [], Unknown: [] },
		groupboxes: {
			Left: leftNode ? parseGroupboxes(leftNode.props.children) : {},
			Right: rightNode ? parseGroupboxes(rightNode.props.children) : {},
			Unknown: {}
		},
		warningBox: {
			Visible: warningProps?.visible ?? false,
			Title: warningProps?.title ?? "",
			IsNormal: warningProps?.isNormal ?? true,
			Text: warningProps?.text ?? "",
			LockSize: warningProps?.lockSize ?? false
		}
	};
}

function parseTabs(children: ReactNode): UIData {
	const tabs: { [key: string]: TabData } = {};

	React.Children.forEach(children, (child) => {
		if (!matchesElement(child, ObsidianTab, "Tab")) return;

		const props = child.props as ObsidianTabProps;
		const subTabs: { [key: string]: TabData } = {};
		let subTabIndex = 0;

		React.Children.forEach(props.children, (subChild) => {
			if (!matchesElement(subChild, ObsidianSubTab, "SubTab")) return;

			const subProps = subChild.props as ObsidianSubTabProps;
			subTabs[subProps.name] = {
				name: subProps.name,
				type: "SubTab",
				icon: subProps.icon ?? "",
				order: subProps.order ?? ++subTabIndex,
				elements: [],
				...parseTabContent(subProps.children)
			};
		});

		const hasSubTabs = Object.keys(subTabs).length > 0;
		tabs[props.name] = {
			name: props.name,
			type: "Tab",
			icon: props.icon ?? "",
			description: props.description,
			tooltip: props.tooltip,
			isKeyTab: props.isKeyTab,
			order: props.order ?? 0,
			elements: props.isKeyTab ? parseElements(props.children, 0).elements : [],
			hasSubTabs: hasSubTabs || undefined,
			subTabs: hasSubTabs ? subTabs : undefined,
			...parseTabContent(props.children)
		};
	});

	return { tabs } as UIData;
}

type RawTab = {
	name?: string;
	type?: string;
	icon?: string;
	description?: string;
	tooltip?: string;
	isKeyTab?: boolean;
	hasSubTabs?: boolean;
	activeSubTab?: string;
	subTabs?: unknown;
	elements?: unknown;
	order?: unknown;
	tabboxes?: { Left?: unknown; Right?: unknown; Unknown?: unknown };
	groupboxes?: { Left?: unknown; Right?: unknown; Unknown?: unknown };
	dependencyGroupboxes?: unknown;
	warningBox?: { Visible?: unknown; Title?: unknown; IsNormal?: unknown; Text?: unknown; LockSize?: unknown };
};

const normalizeGroupSide = (side: unknown): { [key: string]: GroupboxData } => {
	if (Array.isArray(side)) {
		const groupboxes: { [key: string]: GroupboxData } = {};
		for (const groupbox of side as (Partial<GroupboxData> | undefined)[]) {
			if (groupbox && groupbox.name) groupboxes[String(groupbox.name)] = groupbox as GroupboxData;
		}
		return groupboxes;
	}

	return side && typeof side === "object" ? (side as { [key: string]: GroupboxData }) : {};
};

const normalizeTabSide = (side: unknown): TabboxData[] => {
	if (Array.isArray(side)) return side as TabboxData[];
	return side && typeof side === "object" ? Object.values(side as Record<string, TabboxData>) : [];
};

const normalizeTab = (name: string, rawTab: RawTab): TabData => {
	const subTabs: Record<string, TabData> = {};
	if (rawTab.subTabs && typeof rawTab.subTabs === "object") {
		for (const [subName, rawSubTab] of Object.entries(rawTab.subTabs as Record<string, unknown>)) {
			if (rawSubTab && typeof rawSubTab === "object") subTabs[subName] = normalizeTab(subName, rawSubTab as RawTab);
		}
	}

	const hasSubTabs = Object.keys(subTabs).length > 0;
	const tabboxes = rawTab.tabboxes ?? {};
	const groupboxes = rawTab.groupboxes ?? {};

	return {
		name: rawTab.name ?? name,
		type: rawTab.type ?? "Tab",
		icon: rawTab.icon ?? "",
		description: rawTab.description,
		tooltip: rawTab.tooltip,
		isKeyTab: Boolean(rawTab.isKeyTab),
		hasSubTabs: hasSubTabs || undefined,
		activeSubTab: rawTab.activeSubTab,
		subTabs: hasSubTabs ? subTabs : undefined,
		elements: Array.isArray(rawTab.elements) ? (rawTab.elements as TabData["elements"]) : [],
		order: Number(rawTab.order ?? 0),
		tabboxes: {
			Left: normalizeTabSide(tabboxes.Left),
			Right: normalizeTabSide(tabboxes.Right),
			Unknown: normalizeTabSide(tabboxes.Unknown)
		},
		groupboxes: {
			Left: normalizeGroupSide(groupboxes.Left),
			Right: normalizeGroupSide(groupboxes.Right),
			Unknown: normalizeGroupSide(groupboxes.Unknown)
		},
		dependencyGroupboxes: rawTab.dependencyGroupboxes && typeof rawTab.dependencyGroupboxes === "object" ? (rawTab.dependencyGroupboxes as TabData["dependencyGroupboxes"]) : {},
		warningBox: {
			Visible: Boolean(rawTab.warningBox?.Visible ?? false),
			Title: String(rawTab.warningBox?.Title ?? ""),
			IsNormal: Boolean(rawTab.warningBox?.IsNormal ?? true),
			Text: String(rawTab.warningBox?.Text ?? ""),
			LockSize: Boolean(rawTab.warningBox?.LockSize ?? false)
		}
	};
};

function normalizeUIData(data: unknown): UIData | undefined {
	if (!data || typeof data !== "object") return undefined;

	const rawData = data as { tabs?: unknown; metadata?: unknown };
	if (!rawData.tabs || typeof rawData.tabs !== "object") return undefined;

	const tabs: Record<string, TabData> = {};
	for (const [name, rawTab] of Object.entries(rawData.tabs as Record<string, unknown>)) {
		if (rawTab && typeof rawTab === "object") tabs[name] = normalizeTab(name, rawTab as RawTab);
	}

	return { tabs, metadata: rawData.metadata as UIData["metadata"] };
}

export function Obsidian({ title, icon, footer, uiData, children, width, height }: ObsidianWrapperProps) {
	const data = React.useMemo(() => normalizeUIData(uiData) ?? (children ? parseTabs(children) : undefined), [uiData, children]);

	return (
		<UIStateProvider>
			<ObsidianWindow title={title} icon={icon} footer={footer} uiData={data} width={width} height={height} />
		</UIStateProvider>
	);
}