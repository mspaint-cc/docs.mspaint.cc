import { Color3 } from "../element.types";

export const toHex = (value: number): string => {
	const clampedValue = Math.max(0, Math.min(255, Math.round(value)));
	return clampedValue.toString(16).padStart(2, "0");
};

export const rgbToHex = (color: Color3): string => {
	const { r, g, b } = color;
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const rgbToString = (color: Color3): string => {
	return `${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}`;
};

export const hexToRgb = (hex: string): Color3 | null => {
	const match = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
	if (!match) return null;

	const value = parseInt(match[1], 16);
	return {
		r: (value >> 16) & 0xff,
		g: (value >> 8) & 0xff,
		b: value & 0xff
	};
};

export const stringToRgb = (rgbString: string): Color3 | null => {
	const match = /^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/.exec(rgbString.trim());
	if (!match) return null;

	return {
		r: Math.max(0, Math.min(255, parseInt(match[1], 10))),
		g: Math.max(0, Math.min(255, parseInt(match[2], 10))),
		b: Math.max(0, Math.min(255, parseInt(match[3], 10)))
	};
};

export const rgbToHsv = (color: Color3) => {
	const r = color.r / 255;
	const g = color.g / 255;
	const b = color.b / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h = 0;
	if (delta !== 0) {
		if (max === r) {
			h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
		} else if (max === g) {
			h = ((b - r) / delta + 2) / 6;
		} else {
			h = ((r - g) / delta + 4) / 6;
		}
	}

	return {
		h: Math.round(h * 360),
		s: max === 0 ? 0 : delta / max,
		v: max
	};
};

export const hsvToRgb = (h: number, s: number, v: number): Color3 => {
	const normalizedHue = ((h % 360) + 360) % 360;

	const c = v * s;
	const x = c * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
	const m = v - c;

	let r = 0, g = 0, b = 0;
	if (normalizedHue < 60) {
		[r, g, b] = [c, x, 0];
	} else if (normalizedHue < 120) {
		[r, g, b] = [x, c, 0];
	} else if (normalizedHue < 180) {
		[r, g, b] = [0, c, x];
	} else if (normalizedHue < 240) {
		[r, g, b] = [0, x, c];
	} else if (normalizedHue < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255)
	};
};

export const normalizeColor = (val: unknown): Color3 => {
	if (!val) return { r: 255, g: 255, b: 255 };

	if (typeof val === "string") {
		let clean = val.trim();
		if (clean.startsWith("rgb")) {
			const match = /rgb\s*\(([^)]+)\)/i.exec(clean);
			if (match) clean = match[1];
		}

		const parts = clean.split(",").map((p) => p.trim());
		if (parts.length === 3) {
			const r = parseFloat(parts[0]);
			const g = parseFloat(parts[1]);
			const b = parseFloat(parts[2]);

			if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
				const isDecimal = r <= 1 && g <= 1 && b <= 1;
				const mult = isDecimal ? 255 : 1;
				return {
					r: Math.max(0, Math.min(255, Math.round(r * mult))),
					g: Math.max(0, Math.min(255, Math.round(g * mult))),
					b: Math.max(0, Math.min(255, Math.round(b * mult)))
				};
			}
		}

		const cleanHex = clean.startsWith("#") ? clean.slice(1) : clean;
		const value = parseInt(cleanHex, 16);
		if (isNaN(value)) return { r: 255, g: 255, b: 255 };

		return {
			r: (value >> 16) & 0xff,
			g: (value >> 8) & 0xff,
			b: value & 0xff
		};
	}

	const obj = val as Record<string, unknown>;
	return {
		r: typeof obj?.r === "number" ? (obj.r as number) : 255,
		g: typeof obj?.g === "number" ? (obj.g as number) : 255,
		b: typeof obj?.b === "number" ? (obj.b as number) : 255
	};
};

export const formatColor = (color?: string | Color3): string | undefined => {
	if (!color) return undefined;

	if (typeof color === "string") {
		if (color.startsWith("var(") || color.startsWith("hsl(")) return color;
	}

	const normalized = normalizeColor(color);
	return `rgb(${Math.round(normalized.r)}, ${Math.round(normalized.g)}, ${Math.round(normalized.b)})`;
};

export const getBetterColor = (hexOrRgb: string, add: number, isLightTheme = false): string => {
	const { r, g, b } = normalizeColor(hexOrRgb);

	const factor = isLightTheme ? -4 : 2;
	const effectiveAdd = add * factor;

	const newR = Math.max(0, Math.min(255, Math.round(r + effectiveAdd)));
	const newG = Math.max(0, Math.min(255, Math.round(g + effectiveAdd)));
	const newB = Math.max(0, Math.min(255, Math.round(b + effectiveAdd)));

	return `rgb(${newR}, ${newG}, ${newB})`;
};