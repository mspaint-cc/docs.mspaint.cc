"use client";

import { useState, useMemo, useEffect } from "react";
import { OrderedBoxContent } from "../ui/DependencyBox";
import { TabboxTab } from "../element.types";
import { useCornerRadius } from "../providers/ObsidianDataProvider";
import Label from "./Label";
import { getIcon } from "../Window";
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
	const br = useCornerRadius();

	const tabNames = useMemo(() => Object.keys(tabs).sort((a, b) => (tabs[a]?.order ?? 0) - (tabs[b]?.order ?? 0)), [tabs]);
	const [activeTab, setActiveTab] = useState(tabNames[0]);
	const activeTabData = useMemo(() => tabs[activeTab], [tabs, activeTab]);

	useEffect(() => {
		if (tabNames.length && (!activeTab || !tabs[activeTab])) setActiveTab(tabNames[0]);
	}, [tabNames, tabs, activeTab]);
	if (tabNames.length === 0) return null;

	return (
		<div
			className={cn("bg-[var(--background-color)] border border-[var(--outline-color)] relative font-normal", nested ? "my-1" : "mt-1 ml-2 mb-3")}
			style={{ borderRadius: br }}
		>
			<div className="w-full h-[34px] flex flex-row bg-[var(--background-color)]" style={{ borderRadius: br }}>
				<div className="flex flex-row items-center w-full h-full">
					{tabNames.map((name, index) => {
						const IsActive = activeTab === name;
						const Icon = getIcon(tabs[name]?.icon);
						const showLabel = name.trim().length > 0 && !/^\d+$/.test(name);

						return (
							<button
								key={name}
								onClick={() => setActiveTab(name)}
								className="flex flex-1 h-full items-center justify-center gap-2 px-1 text-[13px] border-r border-b last:border-r-0"
								style={{
									borderTopLeftRadius: index === 0 ? br : undefined,
									borderTopRightRadius: index === tabNames.length - 1 ? br : undefined,
									borderRightColor: "var(--outline-color)",
									borderBottomColor: "var(--outline-color)",
									borderBottomWidth: IsActive ? "0px" : "1px",
									backgroundColor: IsActive ? "var(--background-color)" : "var(--main-color)",
									color: "var(--font-color)",
									opacity: IsActive ? 1 : 0.5
								}}
							>
								{Icon && (
									<Icon
										className={cn("shrink-0", showLabel ? "size-[18px]" : "size-[16px]")}
										style={{ color: "var(--accent-color)" }}
									/>
								)}
								{showLabel && <Label className="text-[13px] text-inherit text-center truncate">{name}</Label>}
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
