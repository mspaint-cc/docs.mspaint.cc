import React from "react";
import { formatColor, getBetterColor } from "./color";

export interface ThemeScheme {
	backgroundColor?: string;
	mainColor?: string;
	accentColor?: string;
	outlineColor?: string;
	fontColor?: string;

	redColor?: string;
	destructiveColor?: string;
	darkColor?: string;
	whiteColor?: string;
}

export const DefaultTheme: Required<ThemeScheme> = {
	backgroundColor: "rgb(15, 15, 15)",
	mainColor: "rgb(25, 25, 25)",
	accentColor: "rgb(125, 85, 255)",
	outlineColor: "rgb(40, 40, 40)",
	fontColor: "rgb(255, 255, 255)",

	redColor: "rgb(255, 0, 0)",
	destructiveColor: "rgb(255, 0, 0)",
	darkColor: "rgb(13, 13, 13)",
	whiteColor: "rgb(255, 255, 255)"
};

export const BuiltInThemes: Record<string, ThemeScheme> = {
	"Default": {
		fontColor: "ffffff",
		mainColor: "191919",
		accentColor: "7d55ff",
		backgroundColor: "0f0f0f",
		outlineColor: "282828"
	},
	"BBot": {
		fontColor: "ffffff",
		mainColor: "1e1e1e",
		accentColor: "7e48a3",
		backgroundColor: "232323",
		outlineColor: "141414"
	},
	"Fatality": {
		fontColor: "ffffff",
		mainColor: "1e1842",
		accentColor: "c50754",
		backgroundColor: "191335",
		outlineColor: "3c355d"
	},
	"Jester": {
		fontColor: "ffffff",
		mainColor: "242424",
		accentColor: "db4467",
		backgroundColor: "1c1c1c",
		outlineColor: "373737"
	},
	"Mint": {
		fontColor: "ffffff",
		mainColor: "242424",
		accentColor: "3db488",
		backgroundColor: "1c1c1c",
		outlineColor: "373737"
	},
	"Tokyo Night": {
		fontColor: "ffffff",
		mainColor: "191925",
		accentColor: "6759b3",
		backgroundColor: "16161f",
		outlineColor: "323232"
	},
	"Ubuntu": {
		fontColor: "ffffff",
		mainColor: "3e3e3e",
		accentColor: "e2581e",
		backgroundColor: "323232",
		outlineColor: "191919"
	},
	"Quartz": {
		fontColor: "ffffff",
		mainColor: "232330",
		accentColor: "426e87",
		backgroundColor: "1d1b26",
		outlineColor: "27232f"
	},
	"Nord": {
		fontColor: "eceff4",
		mainColor: "3b4252",
		accentColor: "88c0d0",
		backgroundColor: "2e3440",
		outlineColor: "4c566a"
	},
	"Dracula": {
		fontColor: "f8f8f2",
		mainColor: "44475a",
		accentColor: "ff79c6",
		backgroundColor: "282a36",
		outlineColor: "6272a4"
	},
	"Monokai": {
		fontColor: "f8f8f2",
		mainColor: "272822",
		accentColor: "f92672",
		backgroundColor: "1e1f1c",
		outlineColor: "49483e"
	},
	"Gruvbox": {
		fontColor: "ebdbb2",
		mainColor: "3c3836",
		accentColor: "fb4934",
		backgroundColor: "282828",
		outlineColor: "504945"
	},
	"Solarized": {
		fontColor: "839496",
		mainColor: "073642",
		accentColor: "cb4b16",
		backgroundColor: "002b36",
		outlineColor: "586e75"
	},
	"Catppuccin": {
		fontColor: "d9e0ee",
		mainColor: "302d41",
		accentColor: "f5c2e7",
		backgroundColor: "1e1e2e",
		outlineColor: "575268"
	},
	"One Dark": {
		fontColor: "abb2bf",
		mainColor: "282c34",
		accentColor: "c678dd",
		backgroundColor: "21252b",
		outlineColor: "5c6370"
	},
	"Cyberpunk": {
		fontColor: "f9f9f9",
		mainColor: "262335",
		accentColor: "00ff9f",
		backgroundColor: "1a1a2e",
		outlineColor: "413c5e"
	},
	"Oceanic Next": {
		fontColor: "d8dee9",
		mainColor: "1b2b34",
		accentColor: "6699cc",
		backgroundColor: "16232a",
		outlineColor: "343d46"
	},
	"Material": {
		fontColor: "eeffff",
		mainColor: "212121",
		accentColor: "82aaff",
		backgroundColor: "151515",
		outlineColor: "424242"
	}
};

export const getThemeStyles = (scheme?: ThemeScheme): React.CSSProperties => {
	const s = scheme || DefaultTheme;

	const bgColorRaw = formatColor(s.backgroundColor) || DefaultTheme.backgroundColor;
	const isLightTheme = s.fontColor ? (s.fontColor === "000000" || s.fontColor === "#000000" || s.fontColor === "rgb(0, 0, 0)") : false;

	const layoutMainBackground = getBetterColor(bgColorRaw, -1, isLightTheme);
	const layoutSidebarBackground = bgColorRaw;
	const layoutContainerBackground = getBetterColor(bgColorRaw, 1, isLightTheme);
	const layoutFooterBackground = getBetterColor(bgColorRaw, 4, isLightTheme);

	return {
		"--background-color": bgColorRaw,
		"--main-color": formatColor(s.mainColor) || DefaultTheme.mainColor,
		"--accent-color": formatColor(s.accentColor) || DefaultTheme.accentColor,
		"--outline-color": formatColor(s.outlineColor) || DefaultTheme.outlineColor,
		"--font-color": formatColor(s.fontColor) || DefaultTheme.fontColor,

		"--red-color": formatColor(s.redColor) || DefaultTheme.redColor,
		"--destructive-color": formatColor(s.destructiveColor) || DefaultTheme.destructiveColor,
		"--dark-color": formatColor(s.darkColor) || DefaultTheme.darkColor,
		"--white-color": formatColor(s.whiteColor) || DefaultTheme.whiteColor,

		// Layout Specific Colors //
		"--layout-main-background": layoutMainBackground,
		"--layout-sidebar-background": layoutSidebarBackground,
		"--layout-container-background": layoutContainerBackground,
		"--layout-footer-background": layoutFooterBackground
	} as React.CSSProperties;
};