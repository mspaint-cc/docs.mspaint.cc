"use client";

import { useState, useMemo, useEffect } from "react";
import { ElementParser } from "../ui/DynamicTab";
import { TabboxTab } from "../element.types";
import { useCornerRadius } from "../providers/ObsidianDataProvider";
import Label from "./Label";

export default function Tabbox({ tabs, scope }: { tabs: { [key: string]: TabboxTab }; scope: string }) {
	const br = useCornerRadius();

	const tabNames = useMemo(() => Object.keys(tabs).sort((a, b) => (tabs[a]?.order ?? 0) - (tabs[b]?.order ?? 0)), [tabs]);
	const [activeTab, setActiveTab] = useState(tabNames[0]);
	const activeTabData = useMemo(() => tabs[activeTab], [tabs, activeTab]);

	useEffect(() => {
		if (tabNames.length && (!activeTab || !tabs[activeTab])) setActiveTab(tabNames[0]);
	}, [tabNames, tabs, activeTab]);
	if (tabNames.length === 0) return null;

	return (
		<div className="mt-1 ml-2 mb-3 bg-[var(--background-color)] border border-[var(--outline-color)] relative font-normal" style={{ borderRadius: br }}>
			<div className="w-full h-[38px] flex flex-row bg-[var(--background-color)]" style={{ borderRadius: br }}>
				{/* Buttons */}
				<div className="flex flex-row items-center w-full h-full">
					{tabNames &&
						tabNames.map((name, index) => {
							const IsActive = activeTab === name;
							return (
								<button
									key={name}
									onClick={() => setActiveTab(name)}
									className="flex-1 h-full text-[13px] border-r border-b last:border-r-0"
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
									<Label className="text-[13px] text-inherit text-center w-full block">{name}</Label>
								</button>
							);
						})}
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-col right pt-[8px] pb-[6px] px-[6px] gap-[8px]">
				{activeTabData?.elements?.map((el) => (
					<ElementParser key={`${activeTab}-${el.index}`} element={el} stateKeyPrefix={`${scope}:tab:${activeTab}`} />
				))}
			</div>
		</div>
	);
}
