import { useCornerRadius } from "../providers/ObsidianDataProvider";

export default function Placeholder({ height }: { height: number }) {
	const cornerRadius = useCornerRadius();

	return (
		<div
			className="w-full bg-[var(--main-color)] border-[var(--outline-color)] border flex items-center justify-center"
			style={{ height: `${height}px`, borderRadius: cornerRadius }}
		>
			<p className="text-center text-muted-foreground text-[14px] select-none">Unavailable</p>
		</div>
	);
}