"use client";

import { useState, useMemo } from "react";
import { OrderedBoxContent } from "../ui/DependencyBox";
import { TabboxTab } from "../element.types";
import { useCornerRadius } from "../providers/ObsidianDataProvider";
import Label from "./Label";
import { getIcon } from "../utils/icons";
import type { OptionDefault } from "../utils/dependencies";
import { cn } from "@/lib/utils";

export default function Tabbox({
	tabs,
	scope,
	optionDefaults,
	nested = false
}: {
	tabs: { [key: string]: TabboxTab };
	scope: string;
	optionDefaults: Map<string, OptionDefault>;
	nested?: boolean;
}) {
	const cornerRadius = useCornerRadius();

	const tabNames = useMemo(() => Object.keys(tabs).sort((first, second) => (tabs[first]?.order ?? 0) - (tabs[second]?.order ?? 0)), [tabs]);
	const [selectedTab, setActiveTab] = useState(tabNames[0]);
	const activeTab = selectedTab && tabs[selectedTab] ? selectedTab : tabNames[0];
	const activeTabData = tabs[activeTab];

	if (tabNames.length === 0) return null;

	return (
		<div className={cn("bg-[var(--background-color)] border border-[var(--outline-color)] relative font-normal", !nested && "mb-[10px]")} style={{ borderRadius: cornerRadius }}>
			<div className="w-full h-[34px] flex flex-row bg-[var(--background-color)]" style={{ borderRadius: cornerRadius }}>
				<div className="flex flex-row items-center w-full h-full">
					{tabNames.map((name, tabIndex) => {
						const isActive = activeTab === name;
						const Icon = getIcon(tabs[name]?.icon);
						const showLabel = name.trim().length > 0 && !/^\d+$/.test(name);

						return (
							<button
								key={name}
								onClick={() => setActiveTab(name)}
								className={cn(
									"flex flex-1 min-w-0 h-full items-center justify-center gap-[8px] px-1 text-[15px] border-b text-[var(--font-color)]",
									isActive ? "border-b-transparent bg-[var(--background-color)]" : "border-b-[var(--outline-color)] bg-[var(--main-color)]"
								)}
								style={{
									borderTopLeftRadius: tabIndex === 0 ? cornerRadius : undefined,
									borderTopRightRadius: tabIndex === tabNames.length - 1 ? cornerRadius : undefined
								}}
							>
								{Icon && <Icon className={cn("shrink-0 text-[var(--accent-color)]", showLabel ? "size-[18px]" : "size-[16px]", !isActive && "opacity-50")} />}
								{showLabel && (
									<Label className={cn("w-auto text-[15px] tracking-[0.5px] text-inherit text-center truncate", !isActive && "opacity-50")}>
										{name}
									</Label>
								)}
							</button>
						);
					})}
				</div>
			</div>

			<div className="flex flex-col p-[7px] gap-[8px]">
				<OrderedBoxContent
					elements={activeTabData?.elements}
					tabboxes={activeTabData?.tabboxes}
					dependencyBoxes={activeTabData?.dependencyBoxes}
					scope={`${scope}:tab:${activeTab}`}
					optionDefaults={optionDefaults}
				/>
			</div>
		</div>
	);
}