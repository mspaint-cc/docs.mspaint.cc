import { Inconsolata } from "next/font/google";
export const ObsidianFont = Inconsolata({
	subsets: ["latin"],
	variable: "--font"
});

export const getRobloxLetterSpacing = (fontSize: number) => `${Math.round(fontSize / 2) - fontSize / 2}px`;