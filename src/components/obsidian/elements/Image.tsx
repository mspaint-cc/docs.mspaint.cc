import { Color3 } from "../element.types";
import { useCornerRadius } from "../providers/ObsidianDataProvider";

export default function ObsidianImage({
	image,
	transparency,
	scaleType,
	color,
	rectOffset,
	height,
	rectSize
}: {
	image: string;
	transparency: number;
	scaleType: string;
	color: string | Color3;
	rectOffset: { y: number; x: number };
	height: number;
	rectSize: { y: number; x: number };
}) {
	const br = useCornerRadius();
	return (
		<div
			className={"w-full bg-[rgb(25,25,25)] border-[rgb(40,40,40)] border flex items-center justify-center"}
			style={{ height: `${height}px`, borderRadius: br }}
		>
			<p className="text-center text-muted-foreground text-xs select-none">Unavailable</p>
		</div>
	);
}