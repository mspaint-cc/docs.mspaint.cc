import { useCornerRadius } from "../providers/ObsidianDataProvider";

export default function ObsidianViewport({
	height = 200,
}: {
	height?: number;
}) {
	const br = useCornerRadius();
	return (
		<div
			className="w-full bg-[rgb(25,25,25)] border-[rgb(40,40,40)] border flex items-center justify-center"
			style={{ height: `${height}px`, borderRadius: br }}
		>
			<p className="text-center text-muted-foreground text-xs select-none">
				Unavailable
			</p>
		</div>
	);
}
