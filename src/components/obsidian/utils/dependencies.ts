import type { DependencyRef, GroupboxData, TabboxData, TabData, UIElement } from "../element.types";

export type OptionDefault = {
	type?: string;
	value?: unknown;
};

const collectFromElements = (elements: UIElement[] | undefined, into: Map<string, OptionDefault>) => {
	if (!elements) return;

	for (const element of elements) {
		into.set(String(element.index), { type: element.type, value: "value" in element ? element.value : undefined });
	}
};

const collectFromGroupbox = (groupbox: GroupboxData | undefined, into: Map<string, OptionDefault>) => {
	if (!groupbox) return;

	collectFromElements(groupbox.elements, into);

	for (const depBox of Object.values(groupbox.dependencyBoxes || {})) {
		collectFromGroupbox(depBox, into);
	}

	for (const tabbox of groupbox.tabboxes || []) {
		collectFromTabbox(tabbox, into);
	}

	for (const depGroupbox of groupbox.dependencyGroupboxes || []) {
		collectFromGroupbox(depGroupbox, into);
	}
};

const collectFromTabbox = (tabbox: TabboxData | undefined, into: Map<string, OptionDefault>) => {
	if (!tabbox) return;

	for (const tab of Object.values(tabbox.tabs || {})) {
		collectFromElements(tab.elements, into);
		for (const depBox of Object.values(tab.dependencyBoxes || {})) {
			collectFromGroupbox(depBox, into);
		}

		for (const nestedTabbox of tab.tabboxes || []) {
			collectFromTabbox(nestedTabbox, into);
		}
	}
};

export const collectOptionDefaults = (tabData: TabData | null | undefined): Map<string, OptionDefault> => {
	const into = new Map<string, OptionDefault>();
	if (!tabData) return into;

	collectFromElements(tabData.elements, into);

	for (const side of ["Left", "Right", "Unknown"] as const) {
		for (const groupbox of Object.values(tabData.groupboxes?.[side] || {})) {
			collectFromGroupbox(groupbox, into);
		}

		for (const tabbox of Object.values(tabData.tabboxes?.[side] || {})) {
			collectFromTabbox(tabbox, into);
		}
	}

	for (const depGroupbox of Object.values(tabData.dependencyGroupboxes || {})) {
		collectFromGroupbox(depGroupbox, into);
	}

	return into;
};

export const findLiveOptionValue = (state: Record<string, unknown>, index: string | number): unknown => {
	const needle = String(index);
	const suffixes = [`:el:Toggle:${needle}`, `:el:Dropdown:${needle}`, `:el:Input:${needle}`, `:el:Slider:${needle}`];

	for (const [key, value] of Object.entries(state)) {
		for (const suffix of suffixes) {
			if (key.endsWith(suffix)) return value;
		}
	}

	return undefined;
};

export const resolveOptionValue = (
	state: Record<string, unknown>,
	defaults: Map<string, OptionDefault>,
	index: string | number | null | undefined
): unknown => {
	if (index === null || index === undefined) return undefined;

	const live = findLiveOptionValue(state, index);
	if (live !== undefined) return live;

	return defaults.get(String(index))?.value;
};

export const dependenciesMet = (
	dependencies: DependencyRef[] | undefined,
	state: Record<string, unknown>,
	defaults: Map<string, OptionDefault>
): boolean => {
	if (!dependencies || dependencies.length === 0) return true;

	for (const dependency of dependencies) {
		if (dependency.index === null || dependency.index === undefined) return false;

		const current = resolveOptionValue(state, defaults, dependency.index);
		const expected = dependency.value;
		const optionType = dependency.type || defaults.get(String(dependency.index))?.type;

		if (optionType === "Toggle") {
			if (current !== expected) return false;
			continue;
		}

		if (optionType === "Dropdown") {
			if (current !== null && typeof current === "object" && !Array.isArray(current)) {
				if (!(current as Record<string, boolean>)[String(expected)]) return false;
				continue;
			}

			if (current !== expected) return false;
			continue;
		}

		if (typeof expected === "boolean") {
			if (current !== expected) return false;
		}
	}

	return true;
};
