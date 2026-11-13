"use client";

import { useCallback, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useHalfCornerRadius, useThemeStyles } from "../providers/ObsidianDataProvider";
import { ObsidianFont } from "../fonts";
import { usePortalContainer } from "../utils/hooks";

const OffsetX = 14;
const OffsetY = 12;

export default function ElementTooltip({
	tooltip,
	disabledTooltip,
	disabled,
	children
}: {
	tooltip?: string;
	disabledTooltip?: string;
	disabled?: boolean;
	children: ReactNode;
}) {
	const tooltipText = disabled && disabledTooltip ? disabledTooltip : tooltip;
	const halfCornerRadius = useHalfCornerRadius();
	const themeStyles = useThemeStyles();
	const portalContainer = usePortalContainer();
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0, maxWidth: 240 });

	const hide = useCallback(() => setVisible(false), []);
	const follow = useCallback(
		(clientX: number, clientY: number) => {
			if (!tooltipText) return;

			setPosition({
				x: clientX + OffsetX,
				y: clientY + OffsetY,
				maxWidth: Math.max(80, window.innerWidth - clientX - OffsetX - 8)
			});
			setVisible(true);
		},
		[tooltipText]
	);

	if (!tooltipText) return <>{children}</>;

	return (
		<div className="w-full" onMouseEnter={(event) => follow(event.clientX, event.clientY)} onMouseMove={(event) => follow(event.clientX, event.clientY)} onMouseLeave={hide}>
			{children}
			{visible &&
				portalContainer &&
				createPortal(
					<div
						className={cn(
							"fixed z-[99999] pointer-events-none px-[4px] py-[2px] text-[14px] leading-none whitespace-pre-wrap break-words",
							"text-[var(--font-color)] bg-[var(--background-color)] border border-[var(--outline-color)]",
							ObsidianFont.className
						)}
						style={{ ...themeStyles, left: position.x, top: position.y, maxWidth: position.maxWidth, borderRadius: halfCornerRadius }}
					>
						{tooltipText}
					</div>,
					portalContainer
				)}
		</div>
	);
}