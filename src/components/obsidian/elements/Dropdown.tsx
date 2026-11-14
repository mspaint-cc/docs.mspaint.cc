"use client";

import React from "react";
import { ChevronUp } from "lucide-react";
import { useElementValue } from "../providers/UIStateProvider";
import { ButtonBase, ButtonText } from "./Button";
import Label from "./Label";
import { cn } from "@/lib/utils";
import { ObsidianFont } from "../fonts";
import { createPortal } from "react-dom";
import { useHalfCornerRadius, useThemeStyles } from "../providers/ObsidianDataProvider";
import { useAnchoredRect, useClickOutside, usePortalContainer } from "../utils/hooks";
import type { DropdownDividerValue } from "../element.types";
import { renderIcon } from "../utils/icons";

const NoAnimationClassName = "data-[state=open]:animate-none data-[state=closed]:animate-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";
const ItemHeight = 21;
const MaxPanelHeight = 168;
const Overscan = 6;

type DropdownOptions = (string | DropdownDividerValue)[] | { [key: string]: string };
type DropdownValue = string | string[] | { [key: string]: boolean };
type SelectionMap = Record<string, boolean>;
type DisabledValues = string[] | { [key: string]: unknown } | undefined;
type OptionItem = { key: string; label: string; isDivider?: boolean };

const isDividerValue = (value: unknown): value is DropdownDividerValue =>
	typeof value === "object" && value !== null && (value as DropdownDividerValue).DropdownDivider === true;

const normalizeOptions = (options: DropdownOptions): OptionItem[] => {
	if (Array.isArray(options)) {
		return options.map((option, optionIndex) =>
			isDividerValue(option) ? { key: `__divider_${optionIndex}`, label: option.Title ?? "", isDivider: true } : { key: String(option), label: String(option) }
		);
	}

	return Object.entries(options || {})
		.filter(([, label]) => !isDividerValue(label))
		.map(([key, label]) => ({ key, label: String(label) }));
};

const toSelectionMap = (value: DropdownValue | undefined): SelectionMap => {
	if (typeof value === "string") return { [value]: true };
	if (Array.isArray(value)) return Object.fromEntries(value.map((key) => [key, true]));
	return value ?? {};
};

const toSelectionKey = (value: DropdownValue | undefined): string => {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value[0] ?? "";
	return Object.keys(value ?? {}).find((key) => value?.[key]) ?? "";
};

const isDisabledValue = (disabledValues: DisabledValues, key: string, label: string) => {
	if (!disabledValues) return false;
	if (Array.isArray(disabledValues)) return disabledValues.includes(key) || disabledValues.includes(label);
	return disabledValues[key] !== undefined || disabledValues[label] !== undefined;
};

const stripRichText = (text: string) => text.replace(/<[^>]*>/g, "");

const playerThumbnail = (name: string) => `https://www.roblox.com/headshot-thumbnail/image?userId=1&width=48&height=48&format=png#${encodeURIComponent(name)}`;

const dividerLineClassName = "flex-1 h-[4px] border bg-[var(--main-color)] border-[var(--outline-color)]";

function DropdownDivider({ label }: { label: string }) {
	return (
		<div role="separator" className={cn("flex items-center gap-[9px] px-[7px] select-none", ObsidianFont.className)} style={{ height: `${ItemHeight}px` }}>
			<div className={dividerLineClassName} />
			{label && (
				<>
					<Label className="w-auto text-[14px] text-center opacity-50 shrink-0 whitespace-nowrap" doesWrap={false}>
						{label}
					</Label>
					<div className={dividerLineClassName} />
				</>
			)}
		</div>
	);
}

const DropdownIconClassName = "size-[16px] rounded-sm object-cover shrink-0";

function DropdownOption({
	label,
	icon,
	isSelected,
	isDisabled,
	autoWidth,
	onSelect
}: {
	label: string;
	icon: React.ReactNode;
	isSelected: boolean;
	isDisabled: boolean;
	autoWidth?: boolean;
	onSelect: () => void;
}) {
	return (
		<div
			className={cn(
				"py-0 gap-[5px] flex items-center cursor-pointer text-white",
				icon ? "pl-[4px] pr-[7px]" : "px-[7px]",
				isSelected && "bg-[var(--main-color)]",
				isDisabled ? "opacity-20 cursor-not-allowed" : isSelected ? "opacity-100" : "opacity-50",
				ObsidianFont.className
			)}
			role="option"
			aria-selected={isSelected}
			onPointerDown={(event) => {
				event.preventDefault();
				event.stopPropagation();
				onSelect();
			}}
			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();
			}}
			style={{ height: `${ItemHeight}px` }}
		>
			{icon}
			<Label className={cn("px-0 text-[14px] text-inherit", autoWidth ? "whitespace-nowrap" : "truncate")} doesWrap={false}>
				{label}
			</Label>
		</div>
	);
}

export default function Dropdown({
	text,
	value,
	options,
	multi,
	searchable,
	disabledValues,
	valueImages,
	listLabels,
	displayLabels,
	allowNull,
	specialType,
	enablePlayerImages,
	displayText: initialDisplayText,
	autoWidth,
	keepDisabledValuePosition,
	stateKey
}: {
	text: string;
	value: DropdownValue;
	options: DropdownOptions;
	multi: boolean | undefined;
	searchable?: boolean;
	disabledValues?: DisabledValues;
	valueImages?: { [key: string]: string };
	listLabels?: { [key: string]: string };
	displayLabels?: { [key: string]: string };
	allowNull?: boolean;
	specialType?: string;
	enablePlayerImages?: boolean;
	displayText?: string;
	autoWidth?: boolean;
	keepDisabledValuePosition?: boolean;
	stateKey?: string;
}) {
	const halfCornerRadius = useHalfCornerRadius();
	const themeStyles = useThemeStyles();
	const portalContainer = usePortalContainer();
	const listboxId = React.useId();

	const anchorRef = React.useRef<HTMLDivElement>(null);
	const listboxRef = React.useRef<HTMLDivElement>(null);
	const clickOutsideRefs = React.useMemo(() => [anchorRef, listboxRef] as React.RefObject<HTMLElement | null>[], []);

	const [isOpen, setIsOpen] = React.useState(false);
	const [scrollTop, setScrollTop] = React.useState(0);
	const [searchQuery, setSearchQuery] = React.useState("");
	const anchorRect = useAnchoredRect(anchorRef, isOpen);

	const [storedValue, setStoredValue] = useElementValue<DropdownValue>(stateKey, value);
	const selectedMap = React.useMemo(() => (multi ? toSelectionMap(storedValue) : {}), [multi, storedValue]);
	const selectedKey = multi ? "" : toSelectionKey(storedValue);

	const rawOptionItems = React.useMemo(() => normalizeOptions(options), [options]);
	const optionItems = React.useMemo(
		() => (listLabels ? rawOptionItems.map((item) => (item.isDivider ? item : { ...item, label: listLabels[item.key] ?? item.label })) : rawOptionItems),
		[rawOptionItems, listLabels]
	);
	const labelByKey = React.useMemo(() => Object.fromEntries(rawOptionItems.filter((item) => !item.isDivider).map((item) => [item.key, item.label])), [rawOptionItems]);

	const setOpen = React.useCallback((nextOpen: boolean) => {
		setIsOpen(nextOpen);
		if (nextOpen) return;

		setScrollTop(0);
		setSearchQuery("");
	}, []);

	const closeDropdown = React.useCallback(() => setOpen(false), [setOpen]);
	useClickOutside(clickOutsideRefs, closeDropdown);

	const filteredOptions = React.useMemo(() => {
		const query = searchable ? searchQuery.trim().toLowerCase() : "";
		const groups: { divider?: OptionItem; items: OptionItem[] }[] = [{ items: [] }];

		for (const item of optionItems) {
			if (item.isDivider) {
				groups.push({ divider: item, items: [] });
				continue;
			}

			if (query && !stripRichText(item.label).toLowerCase().includes(query) && !item.key.toLowerCase().includes(query)) continue;
			groups[groups.length - 1].items.push(item);
		}

		const isItemDisabled = (item: OptionItem) => isDisabledValue(disabledValues, item.key, labelByKey[item.key] ?? item.label);
		const result: OptionItem[] = [];
		for (const group of groups) {
			if (query && group.items.length === 0) continue;
			if (group.divider) result.push(group.divider);

			if (keepDisabledValuePosition) result.push(...group.items);
			else result.push(...group.items.filter((item) => !isItemDisabled(item)), ...group.items.filter(isItemDisabled));
		}

		return result;
	}, [optionItems, labelByKey, searchable, searchQuery, keepDisabledValuePosition, disabledValues]);

	const visibleCount = Math.ceil(MaxPanelHeight / ItemHeight) + Overscan;
	const startIndex = Math.max(0, Math.floor(scrollTop / ItemHeight) - Math.floor(Overscan / 2));
	const endIndex = Math.min(filteredOptions.length, startIndex + visibleCount);
	const visibleOptions = filteredOptions.slice(startIndex, endIndex);
	const topSpacer = startIndex * ItemHeight;
	const bottomSpacer = (filteredOptions.length - endIndex) * ItemHeight;

	const normalizeSelection = (selection: DropdownValue) => JSON.stringify(multi ? toSelectionMap(selection) : toSelectionKey(selection));
	const isUnchanged = normalizeSelection(storedValue) === normalizeSelection(value);
	const displayText = (() => {
		if (initialDisplayText && isUnchanged) return initialDisplayText;

		const selectedKeys = multi ? Object.keys(selectedMap).filter((key) => selectedMap[key]) : selectedKey.trim().length ? [selectedKey] : [];
		return selectedKeys.length ? selectedKeys.map((key) => displayLabels?.[key] ?? labelByKey[key] ?? key).join(", ") : "---";
	})();

	const onSelectOption = (optionKey: string, optionLabel: string) => {
		if (isDisabledValue(disabledValues, optionKey, optionLabel)) return;

		if (multi) {
			setStoredValue({ ...selectedMap, [optionKey]: !selectedMap[optionKey] });
			return;
		}

		setStoredValue(allowNull && selectedKey === optionKey ? "" : optionKey);
		setOpen(false);
	};

	const showPlayerImages = specialType === "Player" && enablePlayerImages === true;
	const getOptionIcon = (key: string, label: string) => {
		const iconRef = valueImages?.[key] || valueImages?.[label];
		if (iconRef) return renderIcon(iconRef, DropdownIconClassName);

		return showPlayerImages ? renderIcon(playerThumbnail(label), DropdownIconClassName) : null;
	};
	const firstSelectedKey = multi ? optionItems.find((item) => !item.isDivider && selectedMap[item.key])?.key : selectedKey || undefined;
	const displayIcon = firstSelectedKey ? getOptionIcon(firstSelectedKey, labelByKey[firstSelectedKey] ?? firstSelectedKey) : null;

	return (
		<div className="flex flex-col gap-1">
			{text ? <Label className="text-white opacity-100 leading-[14px]">{text}</Label> : null}

			<div className="relative" ref={anchorRef}>
				<ButtonBase
					containerClassName="justify-start flex relative"
					className="justify-start px-2"
					onClick={(event) => {
						event.stopPropagation();
						setOpen(!isOpen);
					}}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					aria-controls={listboxId}
					style={isOpen ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : undefined}
				>
					<ButtonText className={cn("absolute w-[calc(100%-35px)] justify-start text-left text-white opacity-100 text-[14px]", displayIcon && "left-[4px] gap-[2px]")}>
						{displayIcon}
						<Label className="text-inherit truncate" doesWrap={false}>
							{displayText}
						</Label>
					</ButtonText>
					<div className={cn("absolute right-[4px] top-0 h-full flex items-center", isOpen ? "opacity-100" : "opacity-50")}>
						<ChevronUp className={cn("size-[16px]", isOpen && "-rotate-180")} />
					</div>
				</ButtonBase>

				{isOpen &&
					portalContainer &&
					createPortal(
						<div
							ref={listboxRef}
							onPointerDown={(event) => event.stopPropagation()}
							onMouseDown={(event) => event.stopPropagation()}
							role="listbox"
							id={listboxId}
							aria-multiselectable={!!multi}
							className={cn(
								NoAnimationClassName,
								"fixed z-[9999] max-h-[168px] border overflow-scroll no-scrollbar text-white bg-[var(--background-color)] border-[var(--outline-color)]",
								autoWidth && "w-max"
							)}
							style={{
								...themeStyles,
								left: anchorRect.left,
								top: anchorRect.bottom,
								width: autoWidth ? undefined : anchorRect.width,
								minWidth: anchorRect.width,
								borderRadius: `0 0 ${halfCornerRadius} ${halfCornerRadius}`
							}}
							onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
						>
							{searchable && (
								<div className="sticky top-0 z-10 border-b px-[8px] bg-[var(--background-color)] border-[var(--outline-color)]">
									<input
										type="text"
										placeholder="Search..."
										value={searchQuery}
										onChange={(event) => {
											setSearchQuery(event.target.value);
											setScrollTop(0);
											if (listboxRef.current) listboxRef.current.scrollTop = 0;
										}}
										className="w-full bg-transparent text-white text-[14px] py-1 outline-none placeholder-[rgb(100,100,100)]"
										autoFocus
										onClick={(event) => event.stopPropagation()}
									/>
								</div>
							)}
							{topSpacer > 0 && <div style={{ height: `${topSpacer}px` }} />}
							{visibleOptions.map((optionItem, optionIndex) =>
								optionItem.isDivider ? (
									<DropdownDivider key={startIndex + optionIndex} label={optionItem.label} />
								) : (
									<DropdownOption
										key={startIndex + optionIndex}
										label={optionItem.label}
										icon={getOptionIcon(optionItem.key, labelByKey[optionItem.key])}
										isSelected={multi ? selectedMap[optionItem.key] === true : selectedKey === optionItem.key}
										isDisabled={isDisabledValue(disabledValues, optionItem.key, labelByKey[optionItem.key])}
										autoWidth={autoWidth}
										onSelect={() => onSelectOption(optionItem.key, labelByKey[optionItem.key])}
									/>
								)
							)}
							{bottomSpacer > 0 && <div style={{ height: `${bottomSpacer}px` }} />}
						</div>,
						portalContainer
					)}
			</div>
		</div>
	);
}