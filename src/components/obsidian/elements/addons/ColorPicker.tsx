"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { createPortal } from "react-dom";
import { Color3 } from "../../element.types";
import { useUIState } from "../../providers/UIStateProvider";
import Input from "../Input";
import Label from "../Label";
import * as colorUtils from "../../utils/color";
import { useCornerRadius, useThemeStyles, useThemeScheme } from "../../providers/ObsidianDataProvider";
import { useClickOutside } from "../../utils/hooks";
import { ThemeScheme } from "../../utils/theme";

const GAP = -1;
const PADDING = 8;

const useColorState = (defaultValue: Color3 | string | null, stateKey?: string, activeThemeColor?: Color3 | string | null) => {
	const { state, setState } = useUIState();

	const storedColorRaw = React.useMemo(() => (stateKey ? state[stateKey] : undefined), [stateKey, state]);
	const storedColor = React.useMemo(() => (storedColorRaw ? colorUtils.normalizeColor(storedColorRaw) : undefined), [storedColorRaw]);
	const defaultNormalized = React.useMemo(() => colorUtils.normalizeColor(defaultValue), [defaultValue]);
	const activeThemeNormalized = React.useMemo(() => (activeThemeColor !== null && activeThemeColor !== undefined ? colorUtils.normalizeColor(activeThemeColor) : undefined), [activeThemeColor]);

	const initialColor = storedColor || activeThemeNormalized || defaultNormalized;
	const [color, setColor] = React.useState<Color3>(initialColor);
	const [hsv, setHsv] = React.useState(() => colorUtils.rgbToHsv(initialColor));

	// Keep refs to current values for drag operations //
	const colorRef = React.useRef(color);
	const hsvRef = React.useRef(hsv);
	const prevTargetRef = React.useRef<Color3 | null>(null);

	React.useEffect(() => {
		colorRef.current = color;
		hsvRef.current = hsv;
	}, [color, hsv]);

	const updateFromRgb = React.useCallback(
		(newColor: Color3, updateUIState = true) => {
			setColor(newColor);
			setHsv((prevHsv) => {
				const newHsv = colorUtils.rgbToHsv(newColor);
				return newHsv.s === 0 ? { ...newHsv, h: prevHsv.h } : newHsv;
			});

			if (stateKey && updateUIState) setState(stateKey, newColor);
		},
		[stateKey, setState]
	);

	const updateFromHsv = React.useCallback(
		(newHsv: { h: number; s: number; v: number }, updateUIState = true) => {
			setHsv(newHsv);

			const newColor = colorUtils.hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
			setColor(newColor);

			if (stateKey && updateUIState) setState(stateKey, newColor);
		},
		[stateKey, setState]
	);

	const saveCurrentColor = React.useCallback(() => {
		if (stateKey) setState(stateKey, colorRef.current);
	}, [stateKey, setState]);

	// Sync with stored state or active theme color - only update if external state changed //
	React.useEffect(() => {
		const targetColor = storedColor || activeThemeNormalized || defaultNormalized;
		if (!targetColor) return;

		const externalChanged = !prevTargetRef.current || targetColor.r !== prevTargetRef.current.r || targetColor.g !== prevTargetRef.current.g || targetColor.b !== prevTargetRef.current.b;
		prevTargetRef.current = targetColor;
		if (!externalChanged) return;

		const isDifferent = targetColor.r !== colorRef.current.r || targetColor.g !== colorRef.current.g || targetColor.b !== colorRef.current.b;
		if (!isDifferent) return;

		setColor(targetColor);
		setHsv(colorUtils.rgbToHsv(targetColor));
	}, [storedColor, activeThemeNormalized, defaultNormalized]);

	return {
		color,
		hsv,
		updateFromRgb,
		updateFromHsv,
		saveCurrentColor,
		hexString: colorUtils.rgbToHex(color),
		rgbString: colorUtils.rgbToString(color)
	};
};

const usePopover = () => {
	const { state, setState } = useUIState();
	const localId = React.useId();
	const [isOpen, setIsOpen] = React.useState(false);
	const [position, setPosition] = React.useState({ left: 0, top: 0 });

	const openId = state["colorPicker:openPopover"] as string | undefined;
	const isActive = isOpen && openId === localId;

	const open = React.useCallback(() => {
		setIsOpen(true);
		setState("colorPicker:openPopover", localId);
	}, [localId, setState]);

	const close = React.useCallback(() => {
		setIsOpen(false);
		if (openId === localId) setState("colorPicker:openPopover", "");
	}, [localId, openId, setState]);

	const toggle = React.useCallback(() => {
		if (isOpen) close();
		else open();
	}, [isOpen, open, close]);

	return {
		isActive,
		position,
		setPosition,
		open,
		close,
		toggle
	};
};

const usePositioning = (
	anchorRef: React.RefObject<HTMLButtonElement | null>,
	isActive: boolean,
	setPosition: (pos: { left: number; top: number }) => void
) => {
	const updatePosition = React.useCallback(() => {
		if (!anchorRef.current) return;

		const rect = anchorRef.current.getBoundingClientRect();
		let left = Math.round(rect.left + window.scrollX);
		let top = Math.round(rect.bottom + window.scrollY + GAP);

		// Keep within viewport bounds //
		left = Math.max(PADDING, Math.min(left, window.scrollX + window.innerWidth - PADDING));
		top = Math.max(PADDING, Math.min(top, window.scrollY + window.innerHeight - PADDING));

		setPosition({ left, top });
	}, [anchorRef, setPosition]);

	React.useEffect(() => {
		if (!isActive) return;

		const events = ["resize", "scroll"];
		events.forEach((event) => window.addEventListener(event, updatePosition, true));

		return () => { events.forEach((event) => window.removeEventListener(event, updatePosition, true)); };
	}, [isActive, updatePosition]);

	return updatePosition;
};

const useDragHandler = () => {
	const createDragHandler = React.useCallback(
		(onMove: (x: number, y: number) => void, onEnd?: () => void) => (Event: React.MouseEvent | React.TouchEvent) => {
			Event.preventDefault();

			const handleMove = (EventInstance: MouseEvent | TouchEvent) => {
				const ClientX = EventInstance instanceof TouchEvent ? EventInstance.touches[0]?.clientX : EventInstance.clientX;
				const ClientY = EventInstance instanceof TouchEvent ? EventInstance.touches[0]?.clientY : EventInstance.clientY;
				if (ClientX !== undefined && ClientY !== undefined) onMove(ClientX, ClientY);
			};

			const handleEnd = () => {
				document.removeEventListener("mousemove", handleMove);
				document.removeEventListener("mouseup", handleEnd);
				document.removeEventListener("touchmove", handleMove);
				document.removeEventListener("touchend", handleEnd);
				onEnd?.();
			};

			document.addEventListener("mousemove", handleMove);
			document.addEventListener("mouseup", handleEnd);
			document.addEventListener("touchmove", handleMove, {
				passive: true
			});
			document.addEventListener("touchend", handleEnd, {
				passive: true
			});

			// Initial move //
			const InitialX = Event instanceof TouchEvent ? Event.changedTouches[0]?.clientX : (Event.nativeEvent as MouseEvent).clientX;
			const InitialY = Event instanceof TouchEvent ? Event.changedTouches[0]?.clientY : (Event.nativeEvent as MouseEvent).clientY;
			if (InitialX !== undefined && InitialY !== undefined) onMove(InitialX, InitialY);
		},
		[]
	);

	return createDragHandler;
};

const getThemeKeyFromState = (stateKey?: string): string | null => {
	if (!stateKey) return null;

	const keys = stateKey.split(":");
	const elementIndex = keys[keys.length - 2].trim();

	if (elementIndex === "BackgroundColor") return "backgroundColor";
	if (elementIndex === "MainColor") return "mainColor";
	if (elementIndex === "AccentColor") return "accentColor";
	if (elementIndex === "OutlineColor") return "outlineColor";
	if (elementIndex === "FontColor") return "fontColor";

	return null;
};

export default function ColorPicker({
	title,
	defaultValue,
	className,
	stateKey
}: {
	title: string | null;
	defaultValue: Color3 | string | null;
	className?: string;
	stateKey?: string;
}) {
	// references //
	const rootRef = React.useRef<HTMLDivElement>(null);
	const anchorRef = React.useRef<HTMLButtonElement>(null);
	const panelRef = React.useRef<HTMLDivElement>(null);
	const svRef = React.useRef<HTMLDivElement>(null);
	const hueRef = React.useRef<HTMLDivElement>(null);

	// state hooks //
	const br = useCornerRadius();
	const themeStyles = useThemeStyles();
	const activeScheme = useThemeScheme();

	const themeKey = React.useMemo(() => getThemeKeyFromState(stateKey), [stateKey]);
	const activeThemeColor = React.useMemo(() => {
		if (!themeKey || !activeScheme) return null;
		return activeScheme[themeKey as keyof ThemeScheme];
	}, [themeKey, activeScheme]);

	const { state, setState } = useUIState();
	const { color, hsv, updateFromRgb, updateFromHsv, saveCurrentColor, hexString, rgbString } = useColorState(defaultValue, stateKey, activeThemeColor);
	const storedColorRaw = stateKey ? state[stateKey] : undefined;

	const { isActive, position, setPosition, close, toggle } = usePopover();
	const updatePosition = usePositioning(anchorRef, isActive, setPosition);
	const createDragHandler = useDragHandler();

	React.useEffect(() => {
		if (!themeKey) return;
		if (storedColorRaw !== undefined && color) {
			setState(`theme_override:${themeKey}`, color);
		} else {
			setState(`theme_override:${themeKey}`, undefined);
		}
	}, [themeKey, color, storedColorRaw, setState]);

	// input handlers //
	const handleHexInput = React.useCallback(
		(Event: React.ChangeEvent<HTMLInputElement>) => {
			const newColor = colorUtils.hexToRgb(Event.target.value);
			if (newColor) updateFromRgb(newColor);
		},
		[updateFromRgb]
	);

	const handleRgbInput = React.useCallback(
		(Event: React.ChangeEvent<HTMLInputElement>) => {
			const newColor = colorUtils.stringToRgb(Event.target.value);
			if (newColor) updateFromRgb(newColor);
		},
		[updateFromRgb]
	);

	// drag handlers //
	const handleSvDrag = React.useCallback(
		(ClientX: number, ClientY: number) => {
			if (!svRef.current) return;

			const RectBounds = svRef.current.getBoundingClientRect();
			const Saturation = Math.max(0, Math.min(1, (ClientX - RectBounds.left) / RectBounds.width));
			const Value = Math.max(0, Math.min(1, 1 - (ClientY - RectBounds.top) / RectBounds.height));

			updateFromHsv({ h: hsv.h, s: Saturation, v: Value }, false); // don't update UI state during drag //
		},
		[hsv.h, updateFromHsv]
	);

	const handleHueDrag = React.useCallback(
		(ClientX: number, ClientY: number) => {
			if (!hueRef.current) return;

			const RectBounds = hueRef.current.getBoundingClientRect();
			const NormalizedY = Math.max(0, Math.min(1, (ClientY - RectBounds.top) / RectBounds.height));
			const Hue = NormalizedY * 360;

			updateFromHsv({ h: Hue, s: hsv.s, v: hsv.v }, false);
		},
		[hsv.s, hsv.v, updateFromHsv]
	);

	const handleDragEnd = React.useCallback(() => {
		saveCurrentColor();
	}, [saveCurrentColor]);

	// outside click closing //
	useClickOutside([rootRef, panelRef], () => {
		if (isActive) close();
	});

	// position update on open //
	React.useEffect(() => {
		if (isActive) setTimeout(updatePosition, 0);
	}, [isActive, updatePosition]);

	// drag handlers //
	const svDragHandler = createDragHandler(handleSvDrag, handleDragEnd);
	const hueDragHandler = createDragHandler(handleHueDrag, handleDragEnd);

	return (
		<div ref={rootRef} className="relative pointer-events-auto">
			<button
				type="button"
				ref={anchorRef}
				className={cn(
					"relative flex justify-center items-center w-[21px] h-[20px] border cursor-pointer",
					className
				)}
				style={{
					backgroundColor: `rgb(${rgbString})`,
					borderColor: "var(--outline-color)",
					borderTopLeftRadius: br,
					borderTopRightRadius: br,
					borderBottomLeftRadius: isActive ? 0 : br,
					borderBottomRightRadius: isActive ? 0 : br
				}}
				aria-label="Open color picker"
				aria-haspopup="dialog"
				aria-expanded={isActive}
				onClick={(Event) => {
					Event.preventDefault();
					toggle();
				}}
			/>

			{isActive &&
				typeof window !== "undefined" &&
				createPortal(
					<div onMouseDown={close}>
						<div
							ref={panelRef}
							role="dialog"
							aria-modal="false"
							className="absolute w-[240px] p-[6px] pt-[2px] border origin-top-left scale-[0.8] max-sm:scale-[0.5] md:scale-90 lg:scale-100"
							style={{
								left: position.left,
								top: position.top,
								height: title ? "240px" : "223px",
								backgroundColor: "var(--background-color)",
								borderColor: "var(--outline-color)",
								borderTopLeftRadius: 0,
								borderTopRightRadius: br,
								borderBottomLeftRadius: br,
								borderBottomRightRadius: br,
								...themeStyles
							}}
							onClick={(Event) => Event.stopPropagation()}
							onMouseDown={(Event) => Event.stopPropagation()}
						>
							{title && <Label>{title}</Label>}

							<div
								className="mt-1 mb-1 h-[180px] flex items-stretch gap-1 select-none"
								onMouseDown={(Event) => Event.stopPropagation()}
							>
								{/* Saturation/Value Panel */}
								<div
									ref={svRef}
									className="relative w-[240px] border cursor-crosshair"
									style={{
										background: `
											linear-gradient(to top, black, rgba(0,0,0,0)), 
											linear-gradient(to right, white, hsl(${hsv.h}, 100%, 50%))
										`,
										borderColor: "var(--outline-color)",
										borderRadius: br
									}}
									onMouseDown={svDragHandler}
									onTouchStart={svDragHandler}
								>
									<div
										className="absolute w-[6px] h-[7px] border border-black bg-white box-content pointer-events-none"
										style={{
											left: `${hsv.s * 100}%`,
											top: `${(1 - hsv.v) * 100}%`,
											transform: "translate(-50%, -50%)",
											borderRadius: br
										}}
									/>
								</div>

								{/* Hue Slider */}
								<div
									ref={hueRef}
									className="relative w-[16px] border cursor-pointer"
									style={{
										background: "linear-gradient(to bottom, red, yellow, lime, cyan, blue, magenta, red)",
										borderColor: "var(--outline-color)",
										borderRadius: br
									}}
									onMouseDown={hueDragHandler}
									onTouchStart={hueDragHandler}
								>
									<div
										className="absolute left-[-3px] w-[18px] h-[3px] border border-black bg-white pointer-events-none"
										style={{
											top: `${(hsv.h / 360) * 100}%`,
											transform: "translateY(-50%)",
											borderRadius: br
										}}
									/>
								</div>
							</div>

							{/* Input Fields */}
							<div className="flex flex-row gap-[7px] h-[26px]" onMouseDown={(Event) => Event.stopPropagation()}>
								<Input
									inputClassName="text-center text-[12px]"
									text=""
									value={hexString}
									placeholder="#rrggbb"
									onChanged={handleHexInput}
								/>
								<Input
									inputClassName="text-center text-[12px]"
									text=""
									value={rgbString}
									placeholder="r, g, b"
									onChanged={handleRgbInput}
								/>
							</div>
						</div>
					</div>,
					document.body
				)}
		</div>
	);
}