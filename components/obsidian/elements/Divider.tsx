"use client";

export default function Divider({
  text,
  marginTop = 0,
  marginBottom = 0,
}: {
  text?: string;
  marginTop?: number;
  marginBottom?: number;
}) {
  const marginStyle = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
  };

  if (!text || text.length === 0) {
    return (
      <div
        style={marginStyle}
        className="w-full min-h-1 h-[4px] border-[rgb(40,40,40)] border"
      />
    );
  }

  return (
    <div style={marginStyle} className="w-full flex items-center gap-1">
      <div className="flex-grow h-[4px] border-[rgb(40,40,40)] border" />
      <span className="text-[12px] text-white/50 whitespace-nowrap leading-none">
        {text}
      </span>
      <div className="flex-grow h-[4px] border-[rgb(40,40,40)] border" />
    </div>
  );
}
