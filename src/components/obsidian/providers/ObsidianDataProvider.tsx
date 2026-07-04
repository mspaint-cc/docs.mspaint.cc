"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { ThemeScheme, getThemeStyles, DefaultTheme, BuiltInThemes } from "../utils/theme";
import { formatColor } from "../utils/color";
import { Color3 } from "../element.types";
import { useUIState } from "./UIStateProvider";

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
	const { state, setState } = useUIState();

	const themeListKey = Object.keys(state).find((key) => key.endsWith("ThemeManager_ThemeList"));
	const selectedThemeName = themeListKey ? (state[themeListKey] as string) : undefined;
	const prevThemeNameRef = React.useRef(selectedThemeName);

	React.useEffect(() => {
		if (prevThemeNameRef.current === selectedThemeName) return;
		prevThemeNameRef.current = selectedThemeName;

		for (const key of Object.keys(state)) {
			if (key.startsWith("theme_override:")) {
				setState(key, undefined);
			} else if (key.includes(":addon:ColorPicker:") && (
				key.includes(":BackgroundColor:") ||
				key.includes(":MainColor:") ||
				key.includes(":AccentColor:") ||
				key.includes(":OutlineColor:") ||
				key.includes(":FontColor:")
			)) {
				setState(key, undefined);
			}
		}
	}, [selectedThemeName, setState, state]);

	const activeScheme = React.useMemo(() => {
		const selectedBuiltIn = selectedThemeName ? BuiltInThemes[selectedThemeName] : undefined;
		const baseScheme = scheme 
			? { ...DefaultTheme, ...scheme, ...selectedBuiltIn } 
			: (selectedBuiltIn ? { ...DefaultTheme, ...selectedBuiltIn } : DefaultTheme);

		const overrides: ThemeScheme = {};
		for (const key of ["backgroundColor", "mainColor", "accentColor", "outlineColor", "fontColor"] as const) {
			const val = state[`theme_override:${key}`];
			if (val !== undefined && val !== null) overrides[key] = formatColor(val as string | Color3);
		}

		return {
			...baseScheme,
			...overrides
		};
	}, [scheme, state, selectedThemeName]);

	const themeStyles = React.useMemo(() => getThemeStyles(activeScheme), [activeScheme]);

	return (
		<ObsidianDataContext.Provider value={{ cornerRadius, forceCheckbox, scheme: activeScheme, themeStyles }}>
			<style>{`
				.obsidian-theme-container .text-white { color: var(--font-color) !important; }
				.obsidian-theme-container .stroke-white { stroke: var(--font-color) !important; }
			`}</style>
			<div style={{ ...themeStyles }}>{children}</div>
		</ObsidianDataContext.Provider>
	);
}

export function useCornerRadius() {
	const context = useContext(ObsidianDataContext);
	return `${context.cornerRadius}px`;
}

export function useForceCheckbox() {
	const context = useContext(ObsidianDataContext);
	return context.forceCheckbox;
}

export function useThemeStyles() {
	const context = useContext(ObsidianDataContext);
	return context.themeStyles;
}

export function useThemeScheme() {
	const context = useContext(ObsidianDataContext);
	return context.scheme;
}
