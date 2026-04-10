import { cn } from "@/lib/utils";
import { useCornerRadius } from "../providers/ObsidianDataProvider";

export default function Divider({
  text,
  marginTop = 0,
  marginBottom = 0,
}: {
  text?: string;
  marginTop?: number;
  marginBottom?: number;
}) {
  const br = useCornerRadius();
  const dividerStyle = "h-[4px] bg-[rgb(25,25,25)] border border-[rgb(40,40,40)]";

  marginTop = marginTop + 2;
  marginBottom = marginBottom + 2;

  if (text) {
    return (
      <div
        className="w-full flex items-center gap-2"
        style={{
          marginTop: `${marginTop}px`,
          marginBottom: `${marginBottom}px`,
        }}
      >
        <div className={cn("flex-1", dividerStyle)} style={{ borderRadius: br }} />

        <span
          className="text-white text-xs opacity-30 whitespace-nowrap select-none"
          style={{
            lineHeight: `4px`,
          }}
        >
          {text}
        </span>

        <div className={cn("flex-1", dividerStyle)} style={{ borderRadius: br }} />
      </div>
    );
  }

  return (
    <hr
      className={cn("w-full mt-0 mb-0", dividerStyle)}
      style={{
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        borderRadius: br,
      }}
    />
  );
}
