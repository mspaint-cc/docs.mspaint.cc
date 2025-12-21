"use client";

export default function Divider({ text }: { text?: string }) {
  if (!text || text.length === 0) {
    return <div className="w-full h-[4px] border-[rgb(40,40,40)] border" />;
  }

  return (
    <div className="w-full flex items-center gap-1">
      <div className="flex-grow h-[4px] border-[rgb(40,40,40)] border" />
      <span className="text-[12px] text-white/50 whitespace-nowrap leading-none">
        {text}
      </span>
      <div className="flex-grow h-[4px] border-[rgb(40,40,40)] border" />
    </div>
  );
}
