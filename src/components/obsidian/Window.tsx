import Image from "next/image";
import { MoveDiagonal2, Move, Search, Ellipsis } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/ObsidianRadixTabs";
import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { TabParser } from "./ui/DynamicTab";
import { UIData } from "./element.types";
import { ObsidianFont } from "./fonts";
import { ObsidianDataProvider } from "./providers/ObsidianDataProvider";
import { getIcon } from "./utils/icons";
import Label from "./elements/Label";

interface ObsidianWindowProps {
	title: ReactNode | string;
	icon?: ReactNode | string;
	footer: ReactNode | string;
	uiData?: UIData;
	width?: number | string;
	height?: number | string;
}

const toCssSize = (size: number | string | undefined, fallback: string) => (typeof size === "number" ? `${size}px` : (size ?? fallback));

function ObsidianWindowInner({ title, icon, footer, uiData, width, height }: ObsidianWindowProps) {
	const sortedTabs = React.useMemo(() => (uiData ? Object.entries(uiData.tabs).sort(([, first], [, second]) => first.order - second.order) : []), [uiData]);
	const defaultTab = sortedTabs[0]?.[0] || "Home";
	const [activeTab, setActiveTab] = React.useState(defaultTab);

	if (!uiData) return null;

	const activeTabData = uiData.tabs[activeTab];
	const hasDescription = activeTabData && activeTabData.description;
	const compact = uiData.metadata?.window?.sidebarCompacted === true;

	return (
		<div
			className={cn(
				"obsidian-theme-container rounded-[3px] border relative font-normal leading-none stroke-white text-white bg-[var(--layout-main-background)] border-[var(--outline-color)]",
				ObsidianFont.className
			)}
			style={{ width: toCssSize(width, "720px"), height: toCssSize(height, "600px") }}
		>
			<div className="w-full h-[48px] flex flex-row px-0 border-b bg-[var(--layout-main-background)] border-[var(--outline-color)]">
				<div className={cn("flex flex-row items-center justify-center h-full gap-[3px] border-b shrink-0 border-[var(--outline-color)]", compact ? "w-[48px]" : "w-[30%]")}>
					{typeof icon === "string" ? (
						<Image
							src={icon}
							width={30}
							height={30}
							alt="logo"
							onError={(event) => {
								event.currentTarget.style.display = "none";
							}}
						/>
					) : (
						(icon ?? null)
					)}
					{!compact && <span className="text-white text-[20px] ml-1">{title}</span>}
				</div>

				<div className={cn("h-full flex flex-row items-center border-l border-b px-2 border-[var(--outline-color)]", compact ? "flex-1 min-w-0" : "w-[70%]")}>
					<div className="flex-1 flex flex-row items-center h-full overflow-hidden">
						{hasDescription && (
							<div className="flex flex-col justify-center min-w-0 flex-1 h-full px-2">
								<Label className="font-normal truncate">{activeTabData.name || "Tab"}</Label>

								<Label className="opacity-50 w-[90%]">{activeTabData.description}</Label>
							</div>
						)}

						<div className={cn("flex flex-row items-center gap-2 h-full", !hasDescription ? "flex-1" : "")}>
							<div
								className={cn(
									"relative flex items-center h-[34px] border rounded px-2 bg-[var(--main-color)] border-[var(--outline-color)]",
									hasDescription ? "w-[200px]" : "w-full"
								)}
							>
								<Search className="absolute left-2 text-[#5f5f5f] size-4 shrink-0" />
								<input
									type="text"
									placeholder="Search"
									aria-label="Search"
									className="w-full h-full text-center text-[16px] text-[#fff] bg-transparent placeholder-[#888] outline-none leading-none"
								/>
							</div>
							<Move className="size-6 shrink-0 text-[var(--outline-color)]" />
						</div>
					</div>
				</div>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100%-69px)] w-full flex flex-row gap-0 bg-[var(--main-color)]">
				<TabsList
					className={cn(
						"h-full border-r flex flex-col justify-start rounded-none p-0 overflow-y-auto overflow-x-hidden shrink-0 border-[var(--outline-color)] bg-[var(--layout-sidebar-background)]",
						compact ? "w-[48px] min-w-[48px]" : "min-w-[30%]"
					)}
				>
					{sortedTabs.map(([tabName, tab], tabIndex) => {
						const CustomIcon = getIcon(tab.icon);
						const TabIcon = CustomIcon ?? Ellipsis;
						const iconVisibility = CustomIcon ? "" : compact ? "opacity-50" : "opacity-0";
						return (
							<TabsTrigger
								value={tabName}
								key={tabIndex}
								title={tab.tooltip || (compact ? tabName : undefined)}
								className={cn(
									"flex flex-row items-center w-full max-h-[40px] min-h-[40px] rounded-none data-[state=active]:bg-[var(--main-color)] text-white text-opacity-75 data-[state=active]:text-white",
									compact ? "justify-center p-[6px]" : "justify-start py-[11px] px-[12px]"
								)}
							>
								<TabIcon className={cn("h-full text-[var(--accent-color)]", !compact && "mr-2", iconVisibility)} />
								{!compact && <Label className="text-[16px] leading-none inline text-inherit">{tabName}</Label>}
							</TabsTrigger>
						);
					})}
				</TabsList>

				{sortedTabs.map(([tabName, tab], tabIndex) => (
					<TabsContent value={tabName} key={tabIndex} className="flex flex-col w-full p-0 mt-0 overflow-hidden bg-[var(--layout-container-background)]">
						<TabParser tabData={tab} />
					</TabsContent>
				))}
			</Tabs>

			<div className="h-[20px] w-full border-t absolute bottom-0 flex flex-row items-center justify-center bg-[var(--layout-footer-background)] border-[var(--outline-color)]">
				<p className="text-[14px] text-white opacity-50">{footer}</p>

				<MoveDiagonal2 className="text-white opacity-50 size-[16px] absolute right-0 mr-[2px] pointer-events-none" />
			</div>
		</div>
	);
}

export function ObsidianWindow(props: ObsidianWindowProps) {
	if (!props.uiData) return <div style={{ width: toCssSize(props.width, "720px"), height: toCssSize(props.height, "600px") }} />;

	return (
		<ObsidianDataProvider
			cornerRadius={props.uiData.metadata?.cornerRadius}
			forceCheckbox={props.uiData.metadata?.forceCheckbox}
			scheme={props.uiData.metadata?.scheme}
		>
			<ObsidianWindowInner {...props} />
		</ObsidianDataProvider>
	);
}