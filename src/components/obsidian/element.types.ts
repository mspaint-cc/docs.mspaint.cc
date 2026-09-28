// Data Structures //
export interface Color3 {
	r: number;
	g: number;
	b: number;
}

export interface Vector2 {
	x: number;
	y: number;
}

// Addon Types //
export interface KeyPickerAddon {
	type: "KeyPicker";
	mode?: "Toggle" | "Hold" | "Always" | "Press";
	modes?: string[];
	value: string;
	text?: string;
	displayValue?: string;
	modifiers?: string[];
	defaultModifiers?: string[];
	blacklisted?: string[];
	blacklistedModifiers?: string[];
	whitelisted?: string[];
	whitelistedModifiers?: string[];
	syncToggleState?: boolean;
	toggled?: boolean;
	noUI?: boolean;
	index?: string | number;
}

export interface ColorPickerAddon {
	type: "ColorPicker";
	value: string | Color3;
	title?: string;
	transparency?: number;
	hue?: number;
	sat?: number;
	vib?: number;
	resizable?: boolean;
	index?: string | number;
}

export type Addons = KeyPickerAddon | ColorPickerAddon;

export interface DependencyRef {
	index?: string | number | null;
	type?: string | null;
	text?: string | null;
	value?: unknown;
}

// Element Types //
interface BaseElement {
	index: string | number;
	visible: boolean;
	type: string;
	text: string;
	disabled: boolean;
	tooltip?: string;
	disabledTooltip?: string;
	layoutOrder?: number;
}

export interface ToggleElement extends BaseElement {
	type: "Toggle";
	value: boolean;
	properties: {
		risky: boolean;
		variant?: "Switch" | "Checkbox";
		addons?: Addons[] | undefined;
	};
}

export interface LabelElement extends BaseElement {
	type: "Label";
	properties: {
		doesWrap: boolean;
		size?: number;
		addons?: Addons[] | undefined;
	};
}

export interface ButtonElement extends BaseElement {
	text: string;
	type: "Button";
	icon?: string;
	properties: {
		risky?: boolean;
		doubleClick?: boolean;
		tooltip?: string;
		disabledTooltip?: string;
		icon?: string;
		addons?: Addons[] | undefined;
	};
	subButton?: {
		text: string;
		icon?: string;
		index?: string | number;
		properties?: {
			risky?: boolean;
			doubleClick?: boolean;
			icon?: string;
		};
	};
}

export interface DropdownElement extends BaseElement {
	type: "Dropdown";
	value: string | { [key: string]: boolean };
	properties: {
		values: string[] | { [key: string]: string };
		disabledValues?: string[] | { [key: string]: unknown };
		valueImages?: { [key: string]: string };
		multi?: boolean;
		searchable?: boolean;
		allowNull?: boolean;
		maxVisibleDropdownItems?: number;
		specialType?: "Player" | "Team" | string;
		excludeLocalPlayer?: boolean;
		enablePlayerImages?: boolean;
		addons?: Addons[] | undefined;
	};
}

export interface SliderElement extends BaseElement {
	type: "Slider";
	value: number;
	properties: {
		min: number;
		max: number;
		compact?: boolean;
		rounding?: number;
		hideMax?: boolean;
		prefix?: string;
		suffix?: string;
		allowRightClickInput?: boolean;
		addons?: Addons[] | undefined;
	};
}

export interface InputElement extends BaseElement {
	type: "Input";
	value: string;
	properties: {
		placeholder: string;
		finished?: boolean;
		emptyReset?: string;
		numeric?: boolean;
		clearTextOnFocus?: boolean;
		clearTextOnBlur?: boolean;
		allowEmpty?: boolean;
		maxLength?: number;
		addons?: Addons[] | undefined;
	};
}

export interface DividerElement extends BaseElement {
	type: "Divider";
	properties: {
		text?: string;
		marginTop?: number;
		marginBottom?: number;
	};
}

export interface ImageElement extends BaseElement {
	type: "Image";
	visible: boolean;
	properties: {
		image: string;
		color: string | Color3;
		rectOffset: Vector2;
		rectSize: Vector2;
		height: number;
		scaleType: string;
		transparency: number;
		backgroundTransparency?: number;
	};
}

export interface VideoElement extends BaseElement {
	type: "Video";
	properties: {
		video: string;
		looped: boolean;
		playing: boolean;
		volume: number;
		height: number;
	};
}

export interface ViewportElement extends BaseElement {
	type: "Viewport";
	properties: {
		height: number;
		interactive: boolean;
		autoFocus: boolean;
		clone?: boolean;
		objectClass?: string;
		objectName?: string;
	};
}

export interface UIPassthroughElement extends BaseElement {
	type: "UIPassthrough";
	properties: {
		height: number;
		instanceClass?: string;
		instanceName?: string;
	};
}

export interface KeyBoxElement extends BaseElement {
	type: "KeyBox";
	value?: string;
	properties: {
		placeholder?: string;
	};
}

export type UIElement =
	| ToggleElement
	| LabelElement
	| ButtonElement
	| DropdownElement
	| SliderElement
	| InputElement
	| DividerElement
	| ImageElement
	| VideoElement
	| ViewportElement
	| UIPassthroughElement
	| KeyBoxElement;

// JSON File Types //
export interface GroupboxData {
	type: "Groupbox" | "DependencyBox" | "DependencyGroupbox";
	name: string;
	order: number;
	side?: "Left" | "Right" | "Unknown";
	elements: UIElement[];
	collapsed?: boolean;
	disableCollapsing?: boolean;
	description?: string;
	icon?: string;
	visible?: boolean;
	layoutOrder?: number;
	tabboxes?: TabboxData[];
	dependencyBoxes?: { [key: string]: GroupboxData };
	dependencyGroupboxes?: GroupboxData[];
	dependencies?: DependencyRef[];
}

export interface TabboxTab {
	type: "Tab";
	name: string;
	order: number;
	icon?: string;
	elements: UIElement[];
	visible?: boolean;
	tabboxes?: TabboxData[];
	dependencyBoxes?: { [key: string]: GroupboxData };
}

export interface TabboxData {
	type: "Tabbox";
	name: string;
	order: number;
	layoutOrder?: number;
	side?: "Left" | "Right" | "Unknown";
	tabs: {
		[key: string]: TabboxTab;
	};
	visible?: boolean;
	activeTab?: string;
}

export interface TabData {
	name: string;
	type: string;
	icon: string;
	description?: string;
	tooltip?: string;
	order: number;
	visible?: boolean;
	isKeyTab?: boolean;
	elements?: UIElement[];
	tabboxes: {
		Left: TabboxData[];
		Right: TabboxData[];
		Unknown: TabboxData[];
	};
	groupboxes: {
		Left: { [key: string]: GroupboxData };
		Right: { [key: string]: GroupboxData };
		Unknown: { [key: string]: GroupboxData };
	};
	dependencyGroupboxes?: { [key: string]: GroupboxData };
	warningBox: {
		Visible: boolean;
		Title: string;
		IsNormal: boolean;
		Text: string;
		LockSize: boolean;
	};
}

export interface UIData {
	tabs: {
		[key: string]: TabData;
	};
	elements?: { [key: string]: UIElement };
	metadata?: {
		cornerRadius?: number;
		forceCheckbox?: boolean;
		scheme?: {
			backgroundColor?: string;
			mainColor?: string;
			accentColor?: string;
			outlineColor?: string;
			fontColor?: string;
			redColor?: string;
			destructiveColor?: string;
			darkColor?: string;
			whiteColor?: string;
			backgroundImage?: string;
		};
	};
}
