"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { ThemeScheme, getThemeStyles, DefaultTheme, BuiltInThemes } from "../utils/theme";
import { formatColor } from "../utils/color";
import { Color3 } from "../element.types";
import { useUIState } from "./UIStateProvider";
import { ObsidianFont } from "../fonts";
import { cn } from "@/lib/utils";

interface ObsidianDataContextType {
	cornerRadius: number;
	forceCheckbox: boolean;
	scheme?: ThemeScheme;
	themeStyles: React.CSSProperties;
}

const ObsidianDataContext = createContext<ObsidianDataContextType>({
	cornerRadius: 4,
	forceCheckbox: false,
	themeStyles: {}
});

const ThemeColorKeys = ["backgroundColor", "mainColor", "accentColor", "outlineColor", "fontColor"] as const;
const ThemeColorPickerNames = [":BackgroundColor:", ":MainColor:", ":AccentColor:", ":OutlineColor:", ":FontColor:"];

const isThemeOverrideKey = (key: string) =>
	key.startsWith("theme_override:") ||
	(key.includes(":addon:ColorPicker:") && ThemeColorPickerNames.some((name) => key.includes(name)));

export function ObsidianDataProvider({
	cornerRadius = 4,
	forceCheckbox = false,
	scheme,
	children
}: {
	cornerRadius?: number;
	forceCheckbox?: boolean;
	scheme?: ThemeScheme;
	children: ReactNode;
}) {
	const { state, setState, getState } = useUIState();

	const themeListKey = Object.keys(state).find((key) => key.endsWith("ThemeManager_ThemeList"));
	const selectedThemeName = themeListKey ? (state[themeListKey] as string) : undefined;
	const previousThemeNameRef = React.useRef(selectedThemeName);

	React.useEffect(() => {
		if (previousThemeNameRef.current === selectedThemeName) return;
		previousThemeNameRef.current = selectedThemeName;

		for (const key of Object.keys(getState())) {
			if (isThemeOverrideKey(key)) setState(key, undefined);
		}
	}, [selectedThemeName, setState, getState]);

	const overrideValues = ThemeColorKeys.map((key) => state[`theme_override:${key}`]);
	const overrideDependency = overrideValues.map((value) => (value == null ? "" : JSON.stringify(value))).join("|");

	const activeScheme = React.useMemo(() => {
		const selectedBuiltIn = selectedThemeName ? BuiltInThemes[selectedThemeName] : undefined;
		const overrides: ThemeScheme = {};
		ThemeColorKeys.forEach((key, keyIndex) => {
			const value = overrideValues[keyIndex];
			if (value != null) overrides[key] = formatColor(value as string | Color3);
		});

		return { ...DefaultTheme, ...scheme, ...selectedBuiltIn, ...overrides };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scheme, selectedThemeName, overrideDependency]);

	const themeStyles = React.useMemo(() => getThemeStyles(activeScheme), [activeScheme]);
	const contextValue = React.useMemo(
		() => ({ cornerRadius, forceCheckbox, scheme: activeScheme, themeStyles }),
		[cornerRadius, forceCheckbox, activeScheme, themeStyles]
	);

	return (
		<ObsidianDataContext.Provider value={contextValue}>
			<style>{`
				.obsidian-theme-container .text-white { color: var(--font-color) !important; }
				.obsidian-theme-container .stroke-white { stroke: var(--font-color) !important; }
			`}</style>
			<div className={cn("obsidian-theme-container font-normal leading-none text-white stroke-white", ObsidianFont.className)} style={themeStyles}>
				{children}
			</div>
		</ObsidianDataContext.Provider>
	);
}

export function useCornerRadius() {
	return `${useContext(ObsidianDataContext).cornerRadius}px`;
}

export function useHalfCornerRadius() {
	return `${useContext(ObsidianDataContext).cornerRadius / 2}px`;
}

export function useForceCheckbox() {
	return useContext(ObsidianDataContext).forceCheckbox;
}

export function useThemeStyles() {
	return useContext(ObsidianDataContext).themeStyles;
}

export function useThemeScheme() {
	return useContext(ObsidianDataContext).scheme;
}