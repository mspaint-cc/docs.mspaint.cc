"use client";

import { useCallback, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useCornerRadius, useThemeStyles } from "../providers/ObsidianDataProvider";
import { IBMMono } from "../fonts";

const OFFSET_X = 14;
const OFFSET_Y = 12;

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
	const tip = disabled && disabledTooltip ? disabledTooltip : tooltip;
	const br = useCornerRadius();
	const themeStyles = useThemeStyles();
	const halfBr = `${Math.max(0, parseFloat(br) / 2)}px`;
	const [visible, setVisible] = useState(false);
	const [pos, setPos] = useState({ x: 0, y: 0, maxWidth: 240 });

	const hide = useCallback(() => setVisible(false), []);

	const follow = useCallback(
		(clientX: number, clientY: number) => {
			if (!tip) return;
			setPos({
				x: clientX + OFFSET_X,
				y: clientY + OFFSET_Y,
				maxWidth: Math.max(80, window.innerWidth - clientX - OFFSET_X - 8)
			});
			setVisible(true);
		},
		[tip]
	);

	if (!tip) return <>{children}</>;

	return (
		<div
			className="w-full"
			onMouseEnter={(event) => follow(event.clientX, event.clientY)}
			onMouseMove={(event) => follow(event.clientX, event.clientY)}
			onMouseLeave={hide}
		>
			{children}
			{visible &&
				createPortal(
					<div
						className={IBMMono.className}
						style={{
							...themeStyles,
							position: "fixed",
							left: pos.x,
							top: pos.y,
							zIndex: 99999,
							pointerEvents: "none",
							maxWidth: pos.maxWidth,
							padding: "2px 4px",
							fontSize: 12,
							lineHeight: 1.25,
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
							color: "var(--font-color)",
							backgroundColor: "var(--background-color)",
							border: "1px solid var(--outline-color)",
							borderRadius: halfBr
						}}
					>
						{tip}
					</div>,
					document.body
				)}
		</div>
	);
}
