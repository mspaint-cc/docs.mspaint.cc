"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import Label from "./Label";
import { useUIValue } from "../providers/UIStateProvider";
import { useHalfCornerRadius } from "../providers/ObsidianDataProvider";

const OutlinedTextStyle: React.CSSProperties = {
	WebkitTextStroke: "0.1px #000",
	WebkitTextFillColor: "var(--font-color)",
	textShadow: "0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000"
};

export default function Slider({
	text,
	value,
	defaultValue,
	min = 0,
	max = 100,
	step = 1,
	compact,
	hideMax,
	rounding = 0,
	prefix,
	suffix,
	className,
	onValueChange,
	stateKey
}: {
	text: string;
	value?: number;
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
	compact?: boolean;
	hideMax?: boolean;
	rounding?: number;
	prefix?: string;
	suffix?: string;
	className?: string;
	onValueChange?: (value: number) => void;
	stateKey?: string;
}) {
	const halfCornerRadius = useHalfCornerRadius();
	const [stateValue, setStateValue] = useUIValue<number | undefined>(stateKey, undefined);
	const [internalValue, setInternalValue] = React.useState(stateValue ?? value ?? defaultValue ?? min);
	const trackRef = React.useRef<HTMLDivElement | null>(null);

	const isControlled = value !== undefined && onValueChange !== undefined;
	const currentValue = isControlled ? value : (stateValue ?? internalValue);

	const roundValue = (number: number) => {
		const multiplier = Math.pow(10, rounding);
		return Math.round(number * multiplier) / multiplier;
	};

	const quantizeToStep = (number: number) => {
		if (step <= 0 || !Number.isFinite(step) || max === min) return number;

		const effectiveStep = Math.min(step, Math.pow(10, -rounding));
		const snapped = min + Math.round((number - min) / effectiveStep) * effectiveStep;
		return Math.min(max, Math.max(min, snapped));
	};

	const setFromClientX = (clientX: number) => {
		const track = trackRef.current;
		if (!track) return;

		const rect = track.getBoundingClientRect();
		const fraction = Math.min(1, Math.max(0, rect.width > 0 ? (clientX - rect.left) / rect.width : 0));
		const roundedValue = roundValue(quantizeToStep(min + fraction * (max - min)));

		if (!isControlled) setInternalValue(roundedValue);
		if (stateKey) setStateValue(roundedValue);
		onValueChange?.(roundedValue);
	};

	const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		event.preventDefault();
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {}
		setFromClientX(event.clientX);

		const onMove = (moveEvent: PointerEvent) => setFromClientX(moveEvent.clientX);
		const onUp = () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
		};

		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
	};

	const formatValue = (number: number) => parseFloat(Number(number).toFixed(rounding)).toString();

	const displayValue = roundValue(currentValue);
	const percent = Math.min(100, Math.max(0, max > min ? ((currentValue - min) / (max - min)) * 100 : 0));
	const formattedValue = `${prefix || ""}${formatValue(displayValue)}${hideMax === true || compact ? "" : `/${formatValue(roundValue(max))}`}${suffix || ""}`;

	const sliderBar = (
		<div
			className={cn("relative box-border w-full h-[15px] bg-[var(--main-color)] border-[var(--outline-color)] border", compact && className)}
			style={{ borderRadius: halfCornerRadius }}
		>
			<div
				ref={trackRef}
				role="slider"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={displayValue}
				className="absolute inset-0 cursor-pointer overflow-hidden select-none touch-none"
				style={{ borderRadius: halfCornerRadius }}
				onPointerDown={onPointerDown}
			>
				<div className="absolute left-0 top-0 h-full bg-[var(--accent-color)]" style={{ width: `${percent}%` }} />
			</div>
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<span className="text-center text-white text-[14px] truncate select-none" style={OutlinedTextStyle}>
					{compact ? `${text}: ${formattedValue}` : formattedValue}
				</span>
			</div>
		</div>
	);

	if (compact) return sliderBar;

	return (
		<div className={cn("flex flex-col gap-[4px]", className)}>
			<Label className="text-white opacity-100 leading-[14px]">{text}</Label>
			{sliderBar}
		</div>
	);
}