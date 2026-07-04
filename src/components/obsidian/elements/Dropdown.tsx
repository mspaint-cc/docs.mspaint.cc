"use client";

import React from "react";
import { ChevronUp } from "lucide-react";
import { useUIValue } from "../providers/UIStateProvider";
import { ButtonBase } from "./Button";
import Label from "./Label";
import { cn } from "@/lib/utils";
import { IBMMono } from "../fonts";
import { useCornerRadius } from "../providers/ObsidianDataProvider";
import { useClickOutside } from "../utils/hooks";

const NoAnimationClassName = "data-[state=open]:animate-none data-[state=closed]:animate-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";
const ITEM_HEIGHT = 24;
const MAX_PANEL_HEIGHT = 168;
const OVERSCAN = 6;

export default function Dropdown({
	text,
	value,
	options,
	multi,
	searchable,
	disabledValues = [],
	stateKey
}: {
	text: string;
	value: string | string[] | { [key: string]: boolean };
	options: string[];
	multi: boolean | undefined;
	searchable?: boolean;
	disabledValues?: string[];
	stateKey?: string;
}) {
	const br = useCornerRadius();

	const [scrollTop, setScrollTop] = React.useState(0);
	const listboxRef = React.useRef<HTMLDivElement>(null);
	const listboxId = React.useId();

	const [isOpen, setIsOpen] = React.useState(false);
	const [externalSelected, setExternalSelected] = useUIValue<string | string[] | { [key: string]: boolean }>(stateKey, undefined);

	const anchorRef = React.useRef<HTMLDivElement>(null);
	const clickOutsideRefs = React.useMemo(() => [anchorRef] as React.RefObject<HTMLElement | null>[], []);
	const closeDropdown = React.useCallback(() => setIsOpen(false), []);

	const initial = React.useMemo(() => externalSelected, [externalSelected]);
	const normalizeInitial = React.useCallback((): string | { [key: string]: boolean } => {
		if (multi) {
			if (initial !== undefined) {
				if (initial !== null && typeof initial === "object" && !Array.isArray(initial)) return initial as Record<string, boolean>;
				if (Array.isArray(initial)) return (initial as string[]).reduce((acc, k) => ({ ...acc, [k]: true }), {} as Record<string, boolean>);
				if (typeof initial === "string") return { [initial]: true };
			}

			if (Array.isArray(value)) return (value as string[]).reduce((acc, k) => ({ ...acc, [k]: true }), {} as Record<string, boolean>);
			if (typeof value === "object" && value !== null && !Array.isArray(value)) return value as Record<string, boolean>;
			if (typeof value === "string") return { [value]: true };
			return {};
		}

		if (initial !== undefined) {
			if (typeof initial === "string") return initial as string;
			if (Array.isArray(initial)) return (initial as string[])[0] ?? "";

			if (typeof initial === "object" && initial !== null) {
				const obj = initial as Record<string, boolean>;
				const k = Object.keys(obj).find((kk) => obj[kk]);
				return k ?? "";
			}
		}

		if (typeof value === "string") return value as string;
		if (Array.isArray(value)) return (value as string[])[0] ?? "";

		if (typeof value === "object" && value !== null) {
			const obj = value as Record<string, boolean>;
			const k = Object.keys(obj).find((kk) => obj[kk]);
			return k ?? "";
		}

		return "";
	}, [initial, multi, value]);

	const [local, setLocal] = React.useState<string | { [key: string]: boolean }>(normalizeInitial);

	React.useEffect(() => {
		setLocal(normalizeInitial());
	}, [normalizeInitial]);

	const selected = local;
	const updateSelected = React.useCallback(
		(newVal: string | { [key: string]: boolean }) => {
			setLocal(newVal);
			if (stateKey) setExternalSelected(newVal);
		},
		[setExternalSelected, stateKey]
	);

	const [searchQuery, setSearchQuery] = React.useState("");
	const filteredOptions = React.useMemo(() => {
		if (!searchable || !searchQuery.trim()) return options;

		const q = searchQuery.toLowerCase();
		return options.filter((opt) => opt.toLowerCase().includes(q));
	}, [options, searchable, searchQuery]);

	React.useEffect(() => {
		if (!isOpen) {
			setScrollTop(0);
			setSearchQuery("");
		}
	}, [isOpen]);

	const { visibleOptions, startIndex, topSpacer, bottomSpacer } = React.useMemo(() => {
		const visibleCount = Math.ceil(MAX_PANEL_HEIGHT / ITEM_HEIGHT) + OVERSCAN;
		const startIdx = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - Math.floor(OVERSCAN / 2));
		const endIdx = Math.min(filteredOptions.length, startIdx + visibleCount);
		return {
			visibleOptions: filteredOptions.slice(startIdx, endIdx),
			startIndex: startIdx,
			topSpacer: startIdx * ITEM_HEIGHT,
			bottomSpacer: (filteredOptions.length - endIdx) * ITEM_HEIGHT
		};
	}, [scrollTop, filteredOptions]);

	useClickOutside(clickOutsideRefs, closeDropdown);

	const displayText = React.useMemo(() => {
		if (multi) {
			if (selected && typeof selected === "object" && !Array.isArray(selected)) {
				const keys = Object.keys(selected).filter((k) => (selected as Record<string, boolean>)[k]);
				return keys.length ? keys.join(", ") : "---";
			}

			return "---";
		}

		const s = typeof selected === "string" && selected.trim().length ? selected : "---";
		return s;
	}, [multi, selected]);

	const onScroll = React.useCallback((Event: React.UIEvent<HTMLDivElement>) => {
		const ScrollTopValue = (Event.currentTarget as HTMLDivElement).scrollTop;
		setScrollTop(ScrollTopValue);
	}, []);

	const onSelectOption = React.useCallback(
		(option: string) => {
			if (disabledValues.includes(option)) return;
			if (multi) {
				const selMap: Record<string, boolean> = typeof selected === "object" && !Array.isArray(selected) ? (selected as Record<string, boolean>) : {};
				const isSelected = !!selMap[option];
				updateSelected({ ...selMap, [option]: !isSelected });
			} else {
				updateSelected(option);
				setIsOpen(false);
			}
		},
		[disabledValues, multi, selected, updateSelected]
	);

	return (
		<div className="flex flex-col gap-1">
			<Label className="text-white opacity-100">{text}</Label>

			<div className="relative" ref={anchorRef}>
				<ButtonBase
					text={displayText}
					className="absolute w-[calc(100%-35px)] text-left text-white opacity-100 text-xs"
					containerClassName="justify-start flex relative"
					onClick={(Event) => {
						Event.stopPropagation();
						setIsOpen((PrevIsOpen) => !PrevIsOpen);
					}}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					aria-controls={listboxId}
					style={
						isOpen ? {
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0
						} : undefined
					}
				>
					<div className="absolute right-0 top-0 h-full opacity-50">
						<ChevronUp
							className={cn("w-[20px] mr-1", {
								"-rotate-180": isOpen
							})}
						/>
					</div>
				</ButtonBase>

				{isOpen && (
					<div
						ref={listboxRef}
						onPointerDown={(Event) => Event.stopPropagation()}
						onMouseDown={(Event) => Event.stopPropagation()}
						role="listbox"
						id={listboxId}
						aria-multiselectable={!!multi}
						className={cn(
							NoAnimationClassName,
							"absolute left-0 top-full z-[9999] max-h-[168px] w-full border",
							"overflow-scroll",
							"no-scrollbar",
							"text-white"
						)}
						style={{
							backgroundColor: "var(--background-color)",
							borderColor: "var(--outline-color)",
							borderTopLeftRadius: 0,
							borderTopRightRadius: 0,
							borderBottomLeftRadius: br,
							borderBottomRightRadius: br
						}}
						onScroll={onScroll}
					>
						{searchable && (
							<div
								className="sticky top-0 z-10 border-b px-1"
								style={{
									backgroundColor: "var(--background-color)",
									borderBottomColor: "var(--outline-color)"
								}}
							>
								<input
									type="text"
									placeholder="Search..."
									value={searchQuery}
									onChange={(Event) => {
										setSearchQuery(Event.target.value);
										setScrollTop(0);
										if (listboxRef.current) listboxRef.current.scrollTop = 0;
									}}
									className="w-full bg-transparent text-white text-xs py-1 outline-none placeholder-[rgb(100,100,100)]"
									autoFocus
									onClick={(Event) => Event.stopPropagation()}
								/>
							</div>
						)}
						{topSpacer > 0 && <div style={{ height: `${topSpacer}px` }} />}
						{visibleOptions.map((OptionItem, Index) => {
							const IsSelected = multi ? 
								typeof selected === "object" && 
								selected !== null && 
								!Array.isArray(selected) && 
								(selected as Record<string, boolean>)[OptionItem] === true 
							: selected === OptionItem;
							return (
								<div
									key={startIndex + Index}
									className={cn(
										"py-0 gap-1 px-1 flex items-center cursor-pointer",
										IsSelected && "bg-[var(--outline-color)]",
										disabledValues.includes(OptionItem) && "bg-black opacity-40 cursor-not-allowed",
										IBMMono.className,
									)}
									role="option"
									aria-selected={IsSelected}
									onPointerDown={(Event) => {
										Event.preventDefault();
										Event.stopPropagation();
										onSelectOption(OptionItem);
									}}
									onClick={(Event) => {
										Event.preventDefault();
										Event.stopPropagation();
									}}
									style={{ height: `${ITEM_HEIGHT}px` }}
								>
									<div className="px-0 py-0.75 text-xs">{OptionItem}</div>
								</div>
							);
						})}

						{bottomSpacer > 0 && <div style={{ height: `${bottomSpacer}px` }} />}
					</div>
				)}
			</div>
		</div>
	);
}
