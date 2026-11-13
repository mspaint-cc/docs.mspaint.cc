import { createElement, useState } from "react";
import type { ReactNode } from "react";
import { useCornerRadius } from "../providers/ObsidianDataProvider";
import { getIcon } from "../utils/icons";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Label from "./Label";

interface GroupboxProps {
	title: string;
	icon?: string;
	description?: string;
	collapsed?: boolean;
	disableCollapsing?: boolean;
	children: ReactNode;
}

export function Groupbox({ title, icon, description, collapsed = false, disableCollapsing = false, children }: GroupboxProps) {
	const cornerRadius = useCornerRadius();
	const [isCollapsed, setIsCollapsed] = useState(collapsed);
	const [previousCollapsed, setPreviousCollapsed] = useState(collapsed);
	const hasDescription = typeof description === "string";
	const IconComponent = getIcon(icon);

	if (previousCollapsed !== collapsed) {
		setPreviousCollapsed(collapsed);
		setIsCollapsed(collapsed);
	}

	return (
		<div className="mb-[10px] bg-[var(--background-color)] border border-[var(--outline-color)] relative font-normal" style={{ borderRadius: cornerRadius }}>
			<div
				className={cn(
					"box-border w-full flex flex-row items-center justify-between gap-[2px] bg-[var(--background-color)] p-[6px] select-none border-[var(--outline-color)]",
					isCollapsed ? "border-b-0" : "border-b"
				)}
				style={{ borderRadius: isCollapsed ? cornerRadius : `${cornerRadius} ${cornerRadius} 0 0` }}
				onClick={() => {
					if (!disableCollapsing) setIsCollapsed(!isCollapsed);
				}}
			>
				<div className="flex min-w-0 min-h-[22px] flex-1 flex-row items-center gap-[2px]">
					{IconComponent && createElement(IconComponent, { className: "size-[22px] shrink-0 text-[var(--accent-color)]" })}
					<div className="flex flex-col min-w-0 px-[6px] py-[3px]">
						<Label className="text-[15px] tracking-[0.5px] leading-none pb-[1px]">{title}</Label>
						{hasDescription && (
							<Label className="leading-none min-h-[14px] whitespace-pre-wrap break-words text-[var(--font-color)] opacity-50">{description}</Label>
						)}
					</div>
				</div>

				{!disableCollapsing && (
					<ChevronDown className={cn("size-[22px] shrink-0 self-center ml-auto text-white cursor-pointer", isCollapsed ? "rotate-180" : "rotate-0")} />
				)}
			</div>

			<div className={cn("flex flex-col p-[7px] gap-[8px] min-h-0", isCollapsed && "hidden")}>{children}</div>
		</div>
	);
}