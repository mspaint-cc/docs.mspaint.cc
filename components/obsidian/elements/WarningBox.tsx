import Label from "./Label";
import { useCornerRadius } from "../providers/ObsidianDataProvider";

const ColorScheme = {
  ["Warning"]: {
    Background: "#7f0000",
    Border: "#ff3232",
    Title: "#ff3232",
    Text: "#ffffff",
  },

  ["Normal"]: {
    Background: "#0f0f0f",
    Border: "#282828",
    Title: "#ffffff",
    Text: "#ffffff",
  },
} as const;

export default function ObsidianWarningBox({
  text,
  title,
  isNormal,
  lockSize,
  visible,
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

  const scheme = isNormal ? ColorScheme.Normal : ColorScheme.Warning;
  const role = isNormal ? "note" : "alert";
  const ariaLive = isNormal ? "polite" : "assertive";

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className="w-[calc(100%-20px)] flex flex-col m-2.5 mb-0 px-2 py-1 border"
      style={{ backgroundColor: scheme.Background, borderColor: scheme.Border, borderRadius: br }}
    >
      <Label
        className="text-[12px] font-normal select-text"
        style={{ color: scheme.Title }}
      >
        {title || (isNormal ? "INFO" : "WARNING")}
      </Label>
      <div
        className={lockSize ? "overflow-y-auto" : "overflow-visible"}
        style={lockSize ? { maxHeight: 120 } : undefined}
      >
        <Label className="text-xs font-normal">{text}</Label>
      </div>
    </div>
  );
}
