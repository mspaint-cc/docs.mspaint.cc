import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useCornerRadius } from "../providers/ObsidianDataProvider";
import { getIcon } from "../Window";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupboxProps {
	title: string;
	icon?: string;
	description?: string;
	collapsed?: boolean;
	disableCollapsing?: boolean;
	children: ReactNode;
}

export function Groupbox({ title, icon, description, collapsed = false, disableCollapsing = false, children }: GroupboxProps) {
	const br = useCornerRadius();
	const [isCollapsed, setIsCollapsed] = useState(collapsed);
	const hasDescription = typeof description === "string" && description.length > 0;

	useEffect(() => {
		setIsCollapsed(collapsed);
	}, [collapsed]);

	const IconComponent = getIcon(icon);
	const showCollapseArrow = !disableCollapsing;

	return (
		<div className="mt-1 ml-2 mb-3 bg-[var(--background-color)] border border-[var(--outline-color)] relative font-normal" style={{ borderRadius: br }}>
			<div
				className="box-border w-full flex flex-row items-start justify-between gap-[6px] bg-[var(--background-color)] p-[8px] select-none"
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
				<div className="flex min-w-0 flex-1 flex-row items-start gap-[6px]">
					{IconComponent && (
						<IconComponent className="size-[18px] shrink-0" style={{ color: "var(--accent-color)" }} />
					)}
					<div className="flex flex-col min-w-0 px-[3px] pt-[3px] pb-[3px] gap-px">
						<span className="text-white text-[13px] leading-none pb-[1px]">{title}</span>
						{hasDescription && (
							<span className="text-[12px] leading-none whitespace-pre-wrap break-words" style={{ color: "var(--font-color)", opacity: 0.5 }}>
								{description}
							</span>
						)}
					</div>
				</div>

				{showCollapseArrow && (
					<ChevronDown
						className={cn(
							"size-[22px] shrink-0 self-center ml-auto text-white cursor-pointer",
							isCollapsed ? "rotate-180" : "rotate-0"
						)}
					/>
				)}
			</div>

			<div className={cn("flex flex-col p-[7px] gap-[8px] min-h-0", isCollapsed ? "hidden" : "")}>
				{children}
			</div>
		</div>
	);
}
