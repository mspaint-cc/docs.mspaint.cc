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
	mode: "Toggle" | "Hold" | "Always" | "Press";
	value: string;
	text: string;
}

export interface ColorPickerAddon {
	type: "ColorPicker";
	value: string | Color3;
	title: string;
}

export type Addons = KeyPickerAddon | ColorPickerAddon;

// Element Types //
interface BaseElement {
	index: number;
	visible: boolean;
	type: string;
	text: string;
	disabled: boolean;
	tooltip?: string;
	disabledTooltip?: string;
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
		addons?: Addons[] | undefined;
	};
}

export interface ButtonElement extends BaseElement {
	text: string;
	type: "Button";
	properties: {
		risky?: boolean;
		doubleClick?: boolean;
	};
	subButton?: {
		text: string;
		properties: {
			risky?: boolean;
			doubleClick?: boolean;
		};
	};
}

export interface DropdownElement extends BaseElement {
	type: "Dropdown";
	value: string | { [key: string]: boolean };
	properties: {
		values: string[];
		disabledValues: string[] | undefined;
		multi: boolean | undefined;
		searchable: boolean | undefined;
	};
}

export interface SliderElement extends BaseElement {
	type: "Slider";
	value: number;
	properties: {
		min: number;
		max: number;
		compact: boolean | undefined;
		rounding: number | undefined;
		hideMax: boolean | undefined;
		prefix: string;
		suffix: string;
	};
}

export interface InputElement extends BaseElement {
	type: "Input";
	value: string;
	properties: {
		placeholder: string;
		finished: boolean;
		emptyReset: string;
		numeric: boolean;
		clearTextOnFocus: boolean;
		allowEmpty: boolean;
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
	};
}

export interface UIPassthroughElement extends BaseElement {
	type: "UIPassthrough";
	properties: {
		height: number;
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
	| UIPassthroughElement;

// JSON File Types //
export interface GroupboxData {
	type: "Groupbox" | "DependencyBox" | "DependencyGroupbox";
	name: string;
	order: number;
	side: "Left" | "Right" | "Unknown";
	elements: UIElement[];
	collapsed?: boolean;
	disableCollapsing?: boolean;
	icon?: string;
	visible?: boolean;
	dependencyBoxes?: { [key: string]: GroupboxData };
}

export interface TabboxTab {
	type: "Tab";
	name: string;
	order: number;
	elements: UIElement[];
	visible?: boolean;
	dependencyBoxes?: { [key: string]: GroupboxData };
}

export interface TabboxData {
	type: "Tabbox";
	name: string;
	order: number;
	side: "Left" | "Right" | "Unknown";
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
	order: number;
	visible?: boolean;
	isKeyTab?: boolean;
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
		};
	};
}
