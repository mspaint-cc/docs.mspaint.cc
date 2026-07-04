import Label from "./Label";
import { useCornerRadius } from "../providers/ObsidianDataProvider";

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
	const br = useCornerRadius();

	if (!visible) return null;
	if (title && title.includes("Latest Changelog")) return null;

	const role = isNormal ? "note" : "alert";
	const ariaLive = isNormal ? "polite" : "assertive";
	const scheme = isNormal ? {
		Background: "var(--background-color)",
		Border: "var(--outline-color)",
		Title: "var(--font-color)",
		Text: "var(--font-color)"
	} : {
		Background: "#7f0000",
		Border: "#ff3232",
		Title: "#ff3232",
		Text: "#ffffff"
	};

	return (
		<div
			role={role}
			aria-live={ariaLive}
			className="w-[calc(100%-20px)] flex flex-col m-2.5 mb-0 px-2 py-1 border"
			style={{
				backgroundColor: scheme.Background,
				borderColor: scheme.Border,
				borderRadius: br
			}}
		>
			<Label className="text-[12px] font-normal select-text" style={{ color: scheme.Title }}>
				{title || (isNormal ? "INFO" : "WARNING")}
			</Label>
			<div className={lockSize ? "overflow-y-auto" : "overflow-visible"} style={lockSize ? { maxHeight: 120 } : undefined}>
				<Label className="text-xs font-normal">{text}</Label>
			</div>
		</div>
	);
}
