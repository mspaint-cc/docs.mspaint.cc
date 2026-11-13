"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { createPortal } from "react-dom";
import { MoveDiagonal2 } from "lucide-react";
import { Color3 } from "../../element.types";
import { useUIState, useUIValue } from "../../providers/UIStateProvider";
import { ButtonBase } from "../Button";
import Input from "../Input";
import Label from "../Label";
import * as colorUtils from "../../utils/color";
import { useCornerRadius, useHalfCornerRadius, useThemeStyles, useThemeScheme } from "../../providers/ObsidianDataProvider";
import { useAnchoredRect, useClickOutside, usePortalContainer } from "../../utils/hooks";
import { ThemeScheme } from "../../utils/theme";

const PopoverGap = 0;
const ViewportPadding = 8;
const OpenPopoverKey = "colorPicker:openPopover";

const ThemeKeyByPickerName: Record<string, keyof ThemeScheme> = {
	BackgroundColor: "backgroundColor",
	MainColor: "mainColor",
	AccentColor: "accentColor",
	OutlineColor: "outlineColor",
	FontColor: "fontColor"
};

type HSV = { h: number; s: number; v: number };

const isSameColor = (first: Color3, second: Color3) => first.r === second.r && first.g === second.g && first.b === second.b;

const useColorState = (defaultValue: Color3 | string | null, stateKey?: string, activeThemeColor?: Color3 | string | null, overrideKey?: string) => {
	const { setState } = useUIState();
	const [storedColorRaw] = useUIValue<Color3 | string>(stateKey);

	const storedColor = React.useMemo(() => (storedColorRaw ? colorUtils.normalizeColor(storedColorRaw) : undefined), [storedColorRaw]);
	const defaultNormalized = React.useMemo(() => colorUtils.normalizeColor(defaultValue), [defaultValue]);
	const activeThemeNormalized = React.useMemo(() => (activeThemeColor != null ? colorUtils.normalizeColor(activeThemeColor) : undefined), [activeThemeColor]);

	const targetColor = storedColor || activeThemeNormalized || defaultNormalized;
	const [color, setColor] = React.useState<Color3>(targetColor);
	const [hsv, setHsv] = React.useState(() => colorUtils.rgbToHsv(targetColor));

	const colorRef = React.useRef(color);
	const previousTargetRef = React.useRef<Color3 | null>(null);

	React.useEffect(() => {
		colorRef.current = color;
	}, [color]);

	const applyColor = React.useCallback(
		(newColor: Color3, updateUIState: boolean) => {
			setColor(newColor);
			if (overrideKey) setState(overrideKey, newColor);
			if (stateKey && updateUIState) setState(stateKey, newColor);
		},
		[stateKey, overrideKey, setState]
	);

	const updateFromRgb = React.useCallback(
		(newColor: Color3, updateUIState = true) => {
			setHsv((previousHsv) => {
				const newHsv = colorUtils.rgbToHsv(newColor);
				return newHsv.s === 0 ? { ...newHsv, h: previousHsv.h } : newHsv;
			});
			applyColor(newColor, updateUIState);
		},
		[applyColor]
	);

	const updateFromHsv = React.useCallback(
		(newHsv: HSV, updateUIState = true) => {
			setHsv(newHsv);
			applyColor(colorUtils.hsvToRgb(newHsv.h, newHsv.s, newHsv.v), updateUIState);
		},
		[applyColor]
	);

	const saveCurrentColor = React.useCallback(() => {
		if (stateKey) setState(stateKey, colorRef.current);
	}, [stateKey, setState]);

	React.useEffect(() => {
		if (!targetColor) return;

		const externalChanged = !previousTargetRef.current || !isSameColor(targetColor, previousTargetRef.current);
		previousTargetRef.current = targetColor;
		if (!externalChanged || isSameColor(targetColor, colorRef.current)) return;

		setColor(targetColor);
		setHsv(colorUtils.rgbToHsv(targetColor));
	}, [targetColor]);

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
	const localId = React.useId();
	const [isOpen, setIsOpen] = React.useState(false);
	const [openId, setOpenId] = useUIValue<string>(OpenPopoverKey);
	const isActive = isOpen && openId === localId;

	const close = React.useCallback(() => {
		setIsOpen(false);
		if (openId === localId) setOpenId("");
	}, [localId, openId, setOpenId]);

	const toggle = React.useCallback(() => {
		if (isOpen) {
			close();
			return;
		}

		setIsOpen(true);
		setOpenId(localId);
	}, [isOpen, close, localId, setOpenId]);

	return { isActive, close, toggle };
};

const getClientPoint = (event: MouseEvent | TouchEvent) => {
	const point = "touches" in event ? (event.touches[0] ?? event.changedTouches[0]) : event;
	return point ? { x: point.clientX, y: point.clientY } : null;
};

const createDragHandler = (onMove: (relativeX: number, relativeY: number) => void, onEnd?: () => void) => (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
	event.preventDefault();

	const target = event.currentTarget;
	const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
		const point = getClientPoint(moveEvent);
		if (!point) return;

		const bounds = target.getBoundingClientRect();
		onMove(clamp01((point.x - bounds.left) / bounds.width), clamp01((point.y - bounds.top) / bounds.height));
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
	document.addEventListener("touchmove", handleMove, { passive: true });
	document.addEventListener("touchend", handleEnd, { passive: true });

	handleMove(event.nativeEvent);
};

const getThemeKeyFromState = (stateKey?: string) => {
	if (!stateKey) return null;

	const keys = stateKey.split(":");
	return ThemeKeyByPickerName[keys[keys.length - 2]?.trim()] ?? null;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

let copiedColor: Color3 | null = null;

const ColorActionButton = ({ text, onPress }: { text: string; onPress: () => string }) => {
	const [label, setLabel] = React.useState(text);
	const resetTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

	React.useEffect(() => () => clearTimeout(resetTimer.current), []);

	return (
		<ButtonBase
			containerClassName="h-[20px]"
			className="justify-center text-[14px] text-[var(--font-color)] hover:bg-[color-mix(in_srgb,var(--main-color),white_8%)]"
			onClick={() => {
				setLabel(onPress());
				clearTimeout(resetTimer.current);
				resetTimer.current = setTimeout(() => setLabel(text), 1000);
			}}
		>
			{label}
		</ButtonBase>
	);
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
	const rootRef = React.useRef<HTMLDivElement>(null);
	const anchorRef = React.useRef<HTMLButtonElement>(null);
	const panelRef = React.useRef<HTMLDivElement>(null);
	const halfCornerRadius = useHalfCornerRadius();
	const themeStyles = useThemeStyles();
	const portalContainer = usePortalContainer();
	const activeScheme = useThemeScheme();

	const themeKey = React.useMemo(() => getThemeKeyFromState(stateKey), [stateKey]);
	const activeThemeColor = themeKey && activeScheme ? activeScheme[themeKey] : null;

	const { color, hsv, updateFromRgb, updateFromHsv, saveCurrentColor, hexString, rgbString } = useColorState(defaultValue, stateKey, activeThemeColor, themeKey ? `theme_override:${themeKey}` : undefined);
	const { isActive, close, toggle } = usePopover();
	const anchorRect = useAnchoredRect(anchorRef, isActive);

	const hasWindow = typeof window !== "undefined";
	const popoverLeft = hasWindow ? Math.max(ViewportPadding, Math.min(Math.round(anchorRect.left + window.scrollX) - 1, window.scrollX + window.innerWidth - ViewportPadding)) : 0;
	const popoverTop = hasWindow ? Math.max(ViewportPadding, Math.min(Math.round(anchorRect.bottom + window.scrollY + PopoverGap), window.scrollY + window.innerHeight - ViewportPadding)) : 0;

	const clickOutsideRefs = React.useMemo(() => [rootRef, panelRef], []);
	const closeIfActive = React.useCallback(() => {
		if (isActive) close();
	}, [isActive, close]);
	useClickOutside(clickOutsideRefs, closeIfActive);

	const handleTextInput = (parse: (text: string) => Color3 | null) => (event: React.ChangeEvent<HTMLInputElement>) => {
		const newColor = parse(event.target.value);
		if (newColor) updateFromRgb(newColor);
	};

	const saturationValueDragHandler = createDragHandler((relativeX, relativeY) => {
		updateFromHsv({ h: hsv.h, s: relativeX, v: 1 - relativeY }, false);
	}, saveCurrentColor);

	const hueDragHandler = createDragHandler((_relativeX, relativeY) => {
		updateFromHsv({ h: relativeY * 360, s: hsv.s, v: hsv.v }, false);
	}, saveCurrentColor);

	const stopPropagation = (event: React.SyntheticEvent) => event.stopPropagation();

	return (
		<div ref={rootRef} className="relative pointer-events-auto">
			<button
				type="button"
				ref={anchorRef}
				className={cn("relative flex justify-center items-center size-[21px] outline outline-1 cursor-pointer", className)}
				style={{
					backgroundColor: `rgb(${rgbString})`,
					outlineColor: `rgb(${colorUtils.rgbToString(colorUtils.hsvToRgb(hsv.h, hsv.s, hsv.v / 2))})`,
					borderRadius: isActive ? `${halfCornerRadius} ${halfCornerRadius} 0 0` : halfCornerRadius
				}}
				aria-label="Open color picker"
				aria-haspopup="dialog"
				aria-expanded={isActive}
				onClick={(event) => {
					event.preventDefault();
					toggle();
				}}
			/>

			{isActive &&
				portalContainer &&
				createPortal(
					<div onMouseDown={close}>
						<div
							ref={panelRef}
							role="dialog"
							aria-modal="false"
							className="absolute w-[236px] border overflow-hidden select-none origin-top-left scale-[0.8] max-sm:scale-[0.5] md:scale-90 lg:scale-100 bg-[var(--background-color)] border-[var(--outline-color)]"
							style={{
								left: popoverLeft,
								top: popoverTop,
								borderRadius: `0 ${halfCornerRadius} ${halfCornerRadius} ${halfCornerRadius}`,
								...themeStyles
							}}
							onClick={stopPropagation}
							onMouseDown={stopPropagation}
						>
							<div className="flex flex-col gap-[8px] p-[6px]">
								{title && <Label className="h-[8px] leading-[8px] whitespace-nowrap text-[var(--font-color)]">{title}</Label>}

								<div className="flex flex-row gap-[6px] h-[200px]">
									<div
										className="relative size-[200px] shrink-0 cursor-crosshair"
										style={{ background: `linear-gradient(to top, black, rgba(0,0,0,0)), linear-gradient(to right, white, hsl(${hsv.h}, 100%, 50%))` }}
										onMouseDown={saturationValueDragHandler}
										onTouchStart={saturationValueDragHandler}
									>
										<div
											className="absolute size-[8px] rounded-full border pointer-events-none -translate-x-1/2 -translate-y-1/2 bg-[var(--white-color)] border-[var(--dark-color)]"
											style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
										/>
									</div>

									<div
										className="relative w-[16px] shrink-0 cursor-pointer bg-[linear-gradient(to_bottom,red,yellow,lime,cyan,blue,magenta,red)]"
										onMouseDown={hueDragHandler}
										onTouchStart={hueDragHandler}
									>
										<div
											className="absolute left-[-2px] w-[20px] h-[3px] border pointer-events-none -translate-y-1/2 bg-[var(--white-color)] border-[var(--dark-color)]"
											style={{ top: `${(hsv.h / 360) * 100}%` }}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-[8px]">
									<Input containerClassName="h-[20px]" inputClassName="text-center" text="" value={hexString} placeholder="#rrggbb" onChanged={handleTextInput(colorUtils.hexToRgb)} />
									<Input containerClassName="h-[20px]" inputClassName="text-center" text="" value={rgbString} placeholder="r, g, b" onChanged={handleTextInput(colorUtils.stringToRgb)} />
								</div>

								<div className="grid grid-cols-2 gap-[8px]">
									<ColorActionButton
										text="Copy color"
										onPress={() => {
											copiedColor = color;
											return "Copied color";
										}}
									/>
									<ColorActionButton
										text="Paste color"
										onPress={() => {
											if (!copiedColor) return "Nothing to paste";

											updateFromRgb(copiedColor);
											return "Pasted color";
										}}
									/>
								</div>
							</div>

							<div className="relative flex items-center h-[22px] pl-[6px] pr-[26px] border-t bg-[var(--layout-footer-background)] border-[var(--outline-color)]">
								<span className="w-full truncate text-center text-[14px] text-[var(--font-color)] opacity-50">{`${hexString} \u2022 ${rgbString}`}</span>
								<MoveDiagonal2 className="absolute right-[3px] size-[18px] text-[var(--font-color)] opacity-50 pointer-events-none" />
							</div>
						</div>
					</div>,
					portalContainer
				)}
		</div>
	);
}