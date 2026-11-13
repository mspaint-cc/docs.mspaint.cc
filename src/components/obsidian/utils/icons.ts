import type { ComponentProps, ComponentType } from "react";
import * as LucideIcons from "lucide-react";

type LucideIcon = ComponentType<ComponentProps<"svg">>;

const normalizeIconName = (name?: string) => (name?.endsWith("Icon") ? name.slice(0, -4) : name);

export const getIcon = (name?: string) => {
	const iconName = normalizeIconName(name);
	return (iconName && (LucideIcons as unknown as Record<string, LucideIcon>)[iconName]) || null;
};

export const resolveCustomIconSrc = (icon?: string) => {
	if (!icon) return null;

	const assetId = icon.match(/rbxassetid:\/\/(\d+)/i)?.[1] || (/^\d+$/.test(icon) ? icon : null);
	if (assetId) return `https://www.roblox.com/asset-thumbnail/image?assetId=${assetId}&width=150&height=150&format=png`;
	if (icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/")) return icon;

	return null;
};