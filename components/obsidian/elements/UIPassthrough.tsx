export default function ObsidianUIPassthrough({
  instanceName,
  visible,
  height,
}: {
  height: number;
  instanceName: string;
  visible: boolean;
}) {
  const label = visible ? "UI Unavailable" : "UI Hidden";

  return (
    <div
      className="w-full rounded-[1px] bg-[rgb(25,25,25)] border-[rgb(40,40,40)] border flex items-center justify-center px-3 text-center"
      style={{ height: `${height}px`, opacity: visible ? 1 : 0.5 }}
    >
      <p className="text-muted-foreground text-sm select-none">
        {label}
        {instanceName ? ` (${instanceName})` : null}
      </p>
    </div>
  );
}
