import { cn } from "@/lib/utils";
import createDOMPurify from "dompurify";
import { type ReactNode, type CSSProperties, useMemo, useSyncExternalStore } from "react";
import { getRobloxLetterSpacing } from "../fonts";

let purifier: ReturnType<typeof createDOMPurify> | null = null;
const getPurifier = () => (purifier ??= createDOMPurify(window as unknown as import("dompurify").WindowLike));

const subscribeNothing = () => () => {};

function escapeHtml(input: string) {
	return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}

const toRgbChannels = (match: RegExpExecArray | null) => {
	if (!match) return null;

	const channels = [Number(match[1]), Number(match[2]), Number(match[3])];
	return channels.every((channel) => channel <= 255) ? channels.join(", ") : null;
};

function sanitizeColor(value: string): string | null {
	const color = value.trim();
	if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) return color;

	const rgb = toRgbChannels(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(color)) ?? toRgbChannels(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/.exec(color));
	if (rgb) return `rgb(${rgb})`;

	const rgbaMatch = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|0?\.\d+|1(\.0+)?)\s*\)$/i.exec(color);
	const rgba = toRgbChannels(rgbaMatch);
	if (rgba && rgbaMatch) return `rgba(${rgba}, ${String(parseFloat(rgbaMatch[4]))})`;

	return null;
}

const FontSizePattern = /<\s*font[^>]*\bsize\s*=/i;
const ZeroWidthSpace = "\u200B";

function robloxRichTextToHtml(input: string, perLineHeight: boolean): string {
	if (!input) return "";

	const replacements: string[] = [];
	const tokenSeed = `__RTX_${Date.now()}_${Math.random().toString(36).slice(2)}__`;
	const tokenPattern = new RegExp(`(${tokenSeed}\\d+__)`);
	const makePlaceholder = (html: string) => {
		replacements.push(html);
		return `${tokenSeed}${replacements.length - 1}__`;
	};

	let output = String(input).replace(/<\s*br\s*\/?\s*>/gi, "\n");
	output = output.replace(/<\s*b\s*>/gi, () => makePlaceholder('<span style="font-weight: bold;">'));
	output = output.replace(/<\s*\/\s*b\s*>/gi, () => makePlaceholder("</span>"));
	output = output.replace(/<\s*i\s*>/gi, () => makePlaceholder('<span style="font-style: italic;">'));
	output = output.replace(/<\s*\/\s*i\s*>/gi, () => makePlaceholder("</span>"));
	output = output.replace(/<\s*u\s*>/gi, () => makePlaceholder('<span style="text-decoration: underline;">'));
	output = output.replace(/<\s*\/\s*u\s*>/gi, () => makePlaceholder("</span>"));
	output = output.replace(/<\s*s\s*>/gi, () => makePlaceholder('<span style="text-decoration: line-through;">'));
	output = output.replace(/<\s*\/\s*s\s*>/gi, () => makePlaceholder("</span>"));

	output = output.replace(/<\s*font([^>]*)>/gi, (_match, attributes: string) => {
		let color: string | null = null;
		let size: number | null = null;

		const attributeRegex = /(\w+)\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+)/g;
		let match: RegExpExecArray | null;
		while ((match = attributeRegex.exec(attributes)) !== null) {
			const name = match[1].toLowerCase();
			let rawValue = match[2];
			if ((rawValue.startsWith('"') && rawValue.endsWith('"')) || (rawValue.startsWith("'") && rawValue.endsWith("'"))) rawValue = rawValue.slice(1, -1);

			if (name === "color") {
				color = sanitizeColor(rawValue) ?? color;
			} else if (name === "size") {
				const parsedSize = parseInt(rawValue, 10);
				if (!Number.isNaN(parsedSize)) size = Math.min(Math.max(parsedSize, 1), 100);
			}
		}

		const styles: string[] = [];
		if (color) styles.push(`color: ${color}`);
		if (size !== null) styles.push(`font-size: ${size}px; letter-spacing: ${getRobloxLetterSpacing(size)}`);
		const styleAttribute = styles.length ? ` style=\"${styles.join("; ")}\"` : "";
		return makePlaceholder(`<span${styleAttribute}>`);
	});

	output = output.replace(/<\s*\/\s*font\s*>/gi, () => makePlaceholder("</span>"));

	return output
		.split(tokenPattern)
		.map((part, partIndex) => {
			if (partIndex % 2 === 1) return replacements[Number(part.slice(tokenSeed.length, -2))];
			if (part === "") return "";

			const escapedText = escapeHtml(part);
			if (!perLineHeight) return escapedText.replace(/\r\n|\n|\r/g, "<br/>");

			const linedText = escapedText.replace(/\r\n|\n|\r/g, `${ZeroWidthSpace}<br/>${ZeroWidthSpace}`);
			return `<span style="line-height: 1; vertical-align: top">${linedText}</span>`;
		})
		.join("");
}

export default function Label({
	children,
	className,
	style,
	doesWrap = true
}: {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
	doesWrap?: boolean;
}) {
	const finalClassName = cn(
		"text-left block text-white text-[14px] max-w-full min-w-0",
		className,
		doesWrap ? "" : "whitespace-nowrap overflow-hidden"
	);
	const isClient = useSyncExternalStore(subscribeNothing, () => true, () => false);
	const perLineHeight = typeof children === "string" && FontSizePattern.test(children);
	const sanitized = useMemo(() => {
		if (!isClient || typeof children !== "string") return "";

		return getPurifier().sanitize(robloxRichTextToHtml(children, perLineHeight), {
			ALLOWED_TAGS: ["b", "i", "u", "s", "br", "span"],
			ALLOWED_ATTR: ["style"]
		});
	}, [isClient, children, perLineHeight]);

	if (sanitized !== "") {
		return <span className={finalClassName} style={perLineHeight ? { ...style, lineHeight: 0 } : style} dangerouslySetInnerHTML={{ __html: sanitized }} />;
	}

	return (
		<span className={finalClassName} style={style}>
			{children}
		</span>
	);
}