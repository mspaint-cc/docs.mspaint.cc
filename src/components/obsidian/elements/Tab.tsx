import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TabContainer({ children }: { children: ReactNode }) {
	return (
		<div className="w-full flex flex-1 flex-col min-h-0 overflow-hidden mt-[6px]">
			<div className="flex flex-row w-full overflow-hidden min-h-0">{children}</div>
		</div>
	);
}

export function TabColumn({ side, children }: { side: "Left" | "Right"; children: ReactNode }) {
	return <div className={cn("flex-1 min-w-0 overflow-y-scroll no-scrollbar", side === "Left" ? "pl-2 pr-[5px]" : "pl-[5px] pr-2")}>{children}</div>;
}