import Label from "./Label";
import { useCornerRadius, useThemeScheme } from "../providers/ObsidianDataProvider";
import { normalizeColor } from "../utils/color";

const NormalScheme = { background: "var(--background-color)", border: "var(--outline-color)", title: "var(--font-color)", titleStroke: "var(--outline-color)" };
const WarningScheme = { background: "#7f0000", border: "#ff3232", title: "#ff3232", titleStroke: "#a90000" };

const getTextStroke = (color: string) => `0 1px 0 ${color}, 1px 0 0 ${color}, 0 -1px 0 ${color}, -1px 0 0 ${color}`;

const getTextStrokeColor = (fontColor?: string) => {
	const { r, g, b } = normalizeColor(fontColor);
	return (r * 0.299 + g * 0.587 + b * 0.114) / 255 > 0.5 ? "var(--dark-color)" : "var(--white-color)";
};

export default function ObsidianWarningBox({
	text,
	title,
	isNormal,
	lockSize,
	visible
}: {
	text: string;
	title: string;
	isNormal: boolean;
	lockSize: boolean;
	visible: boolean;
}) {
	const cornerRadius = useCornerRadius();
	const scheme = useThemeScheme();

	if (!visible) return null;
	if (title && title.includes("Latest Changelog")) return null;

	const colors = isNormal ? NormalScheme : WarningScheme;

	return (
		<div
			role={isNormal ? "note" : "alert"}
			aria-live={isNormal ? "polite" : "assertive"}
			className="w-[calc(100%-20px)] flex flex-col m-2.5 mb-0 pt-[5px] pb-[7px] px-[6px] border"
			style={{ backgroundColor: colors.background, borderColor: colors.border, borderRadius: cornerRadius }}
		>
			<div className="flex items-center h-[14px] mb-[2px]">
				<Label className="font-normal select-text" style={{ color: colors.title, textShadow: getTextStroke(colors.titleStroke) }}>
					{title || (isNormal ? "INFO" : "WARNING")}
				</Label>
			</div>
			<div className={lockSize ? "overflow-y-auto max-h-[120px]" : "overflow-visible"}>
				<Label className="font-normal" style={{ textShadow: getTextStroke(getTextStrokeColor(scheme?.fontColor)) }}>
					{text}
				</Label>
			</div>
		</div>
	);
}