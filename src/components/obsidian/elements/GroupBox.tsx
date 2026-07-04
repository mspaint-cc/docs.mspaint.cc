import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useCornerRadius } from "../providers/ObsidianDataProvider";
import { getIcon } from "../Window";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupboxProps {
	title: string;
	icon?: string;
	collapsed?: boolean;
	disableCollapsing?: boolean;
	children: ReactNode;
}

export function Groupbox({ title, icon, collapsed = false, disableCollapsing = false, children }: GroupboxProps) {
	const br = useCornerRadius();
	const [isCollapsed, setIsCollapsed] = useState(collapsed);

	useEffect(() => {
		setIsCollapsed(collapsed);
	}, [collapsed]);

	const IconComponent = getIcon(icon);
	const showCollapseArrow = !disableCollapsing;

	return (
		<div className="mt-1 ml-2 mb-3 bg-[var(--background-color)] border border-[var(--outline-color)] relative font-normal" style={{ borderRadius: br }}>
			{/* Top Bar */}
			<div
				className={cn(
					"w-full h-[38px] flex flex-row items-center justify-between bg-[var(--background-color)] pr-3 select-none",
					IconComponent ? "pl-[6px]" : "pl-3"
				)}
				style={{
					borderTopLeftRadius: br,
					borderTopRightRadius: br,
					borderBottomLeftRadius: isCollapsed ? br : 0,
					borderBottomRightRadius: isCollapsed ? br : 0,
					borderBottomWidth: !isCollapsed ? "1px" : "0px",
					borderBottomColor: "var(--outline-color)"
				}}
				onClick={() => {
					if (!disableCollapsing) {
						setIsCollapsed(!isCollapsed);
					}
				}}
			>
				{/* Left Title & Icon */}
				<div className="flex flex-row items-center gap-[6px] h-full py-[6px]">
					{IconComponent && <IconComponent className="size-[22px] flex-shrink-0" style={{ color: "var(--accent-color)" }} />}
					<span className="text-white text-[14px] mt-[2px]">{title}</span>
				</div>

				{/* Right Collapse Arrow */}
				{showCollapseArrow && (
					<ChevronDown
						className={cn("text-white size-[22px] flex-shrink-0 cursor-pointer", isCollapsed ? "rotate-180" : "rotate-0")}
					/>
				)}
			</div>

			{/* Content */}
			<div className={cn("flex flex-col right pt-[8px] pb-[6px] px-[6px] gap-[8px] min-h-0", isCollapsed ? "hidden" : "")}>
				{children}
			</div>
		</div>
	);
}
