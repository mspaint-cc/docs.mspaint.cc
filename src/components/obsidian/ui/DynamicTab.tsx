import { memo, useMemo, FC } from "react";

import { TabData, TabboxData, GroupboxData } from "../element.types";
import { Groupbox } from "../elements/GroupBox";
import { TabColumn, TabContainer } from "../elements/Tab";
import Tabbox from "../elements/TabBox";
import ObsidianWarningBox from "../elements/WarningBox";
import { ElementParser } from "./ElementParser";
import { OrderedBoxContent } from "./DependencyBox";
import { collectOptionDefaults, dependenciesMet, type OptionDefault } from "../utils/dependencies";
import { useUIState, useUIValue } from "../providers/UIStateProvider";
import { useCornerRadius, useHalfCornerRadius } from "../providers/ObsidianDataProvider";
import { getIcon } from "../utils/icons";
import { cn } from "@/lib/utils";

type Side = "Left" | "Right";

const byLayoutOrder = (first: GroupboxData, second: GroupboxData) => (first.layoutOrder ?? 0) - (second.layoutOrder ?? 0);

const GroupboxRenderer: FC<{
	groupbox: GroupboxData;
	scope: string;
	optionDefaults: Map<string, OptionDefault>;
}> = ({ groupbox, scope, optionDefaults }) => {
	if (groupbox.visible === false) return null;

	return (
		<>
			<Groupbox
				title={groupbox.name}
				description={groupbox.description}
				collapsed={groupbox.collapsed}
				disableCollapsing={groupbox.disableCollapsing}
				icon={groupbox.icon}
			>
				<OrderedBoxContent
					elements={groupbox.elements}
					tabboxes={groupbox.tabboxes}
					dependencyBoxes={groupbox.dependencyBoxes}
					scope={scope}
					optionDefaults={optionDefaults}
				/>
			</Groupbox>

			{[...(groupbox.dependencyGroupboxes || [])].sort(byLayoutOrder).map((dependencyGroupbox) => (
				<DependencyGroupboxRenderer
					key={`depgroup-${dependencyGroupbox.name}`}
					dependencyGroupbox={dependencyGroupbox}
					scope={`${scope}:depgroup:${dependencyGroupbox.name}`}
					optionDefaults={optionDefaults}
				/>
			))}
		</>
	);
};

const DependencyGroupboxRenderer: FC<{
	dependencyGroupbox: GroupboxData;
	scope: string;
	optionDefaults: Map<string, OptionDefault>;
}> = ({ dependencyGroupbox, scope, optionDefaults }) => {
	const { state } = useUIState();
	const cornerRadius = useCornerRadius();
	if (!dependenciesMet(dependencyGroupbox.dependencies, state, optionDefaults)) return null;

	return (
		<div
			className="-mt-[4px] mb-[10px] flex flex-col p-[7px] gap-[8px] bg-[var(--background-color)] border border-[var(--outline-color)] font-normal"
			style={{ borderRadius: cornerRadius }}
		>
			<OrderedBoxContent
				elements={dependencyGroupbox.elements}
				tabboxes={dependencyGroupbox.tabboxes}
				dependencyBoxes={dependencyGroupbox.dependencyBoxes}
				scope={scope}
				optionDefaults={optionDefaults}
			/>
		</div>
	);
};

const SubTabsRenderer: FC<{ tabData: TabData }> = ({ tabData }) => {
	const halfCornerRadius = useHalfCornerRadius();
	const sortedSubTabs = useMemo(
		() => Object.entries(tabData.subTabs || {}).sort(([, first], [, second]) => (first.order ?? 0) - (second.order ?? 0)),
		[tabData.subTabs]
	);
	const fallbackSubTab = tabData.activeSubTab && tabData.subTabs?.[tabData.activeSubTab] ? tabData.activeSubTab : sortedSubTabs[0]?.[0];
	const [activeSubTab, setActiveSubTab] = useUIValue<string>(`subtab:${tabData.name}`, fallbackSubTab);
	const activeSubTabData = (activeSubTab && tabData.subTabs?.[activeSubTab]) || null;

	return (
		<div className="flex flex-col w-full h-full min-h-0">
			<div className="flex flex-row gap-[8px] h-[30px] mt-[5px] mx-[8px] px-[1px] py-[3px] overflow-x-auto overflow-y-hidden no-scrollbar shrink-0">
				{sortedSubTabs.map(([subTabName, subTab]) => {
					const isActive = subTabName === activeSubTab;
					const SubTabIcon = getIcon(subTab.icon);
					const stateOpacity = isActive ? "opacity-100" : "opacity-50 group-hover/subtab:opacity-75";

					return (
						<button
							type="button"
							key={subTabName}
							onClick={() => setActiveSubTab(subTabName)}
							className="group/subtab flex flex-row items-center justify-center gap-[6px] px-[8px] h-full shrink-0 bg-[var(--main-color)]"
							style={{
								outline: `1px solid ${isActive ? "var(--accent-color)" : "var(--outline-color)"}`,
								borderRadius: halfCornerRadius
							}}
						>
							{SubTabIcon && <SubTabIcon className={cn("size-[16px] shrink-0 transition-opacity text-[var(--accent-color)]", stateOpacity)} />}
							<span className={cn("text-[14px] leading-[16px] whitespace-nowrap transition-opacity text-[var(--font-color)]", stateOpacity)}>{subTabName}</span>
						</button>
					);
				})}
			</div>

			<div className="h-px w-full shrink-0 mt-[5px] bg-[var(--outline-color)]" />

			<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
				<TabParser tabData={activeSubTabData} />
			</div>
		</div>
	);
};

const sortSideBoxes = (tabData: TabData | null, side: Side) => {
	const groupboxes = Object.values(tabData?.groupboxes?.[side] ?? {});
	const tabboxes = Object.values(tabData?.tabboxes?.[side] ?? {});
	return [...groupboxes, ...tabboxes].filter(Boolean).sort((first, second) => (first.order ?? 0) - (second.order ?? 0));
};

const TabParserComponent: FC<{ tabData: TabData | null }> = ({ tabData }) => {
	const optionDefaults = useMemo(() => collectOptionDefaults(tabData), [tabData]);
	const sideBoxes = useMemo(() => ({ Left: sortSideBoxes(tabData, "Left"), Right: sortSideBoxes(tabData, "Right") }), [tabData]);

	if (!tabData) return null;
	if (tabData.hasSubTabs && tabData.subTabs) return <SubTabsRenderer tabData={tabData} />;

	if (tabData.isKeyTab) {
		return (
			<div className="flex flex-col items-center justify-center gap-[8px] w-full h-full px-[1px] overflow-y-auto">
				{(tabData.elements || []).map((element) => (
					<div key={`keytab-${element.index}`} className="w-full [&_.text-left]:text-center">
						<ElementParser element={element} stateKeyPrefix={`keytab:${tabData.name}`} />
					</div>
				))}
			</div>
		);
	}

	const renderSide = (side: Side) => {
		const sideName = side.toLowerCase();

		return (
			<TabColumn side={side}>
				{sideBoxes[side].map((box) =>
					box.type === "Tabbox" ? (
						<Tabbox key={box.name} tabs={(box as TabboxData).tabs} scope={`tab:${tabData.name}:${sideName}:tabbox:${box.name}`} optionDefaults={optionDefaults} />
					) : (
						<GroupboxRenderer key={box.name} groupbox={box as GroupboxData} scope={`gb:${tabData.name}:${sideName}:groupbox:${box.name}`} optionDefaults={optionDefaults} />
					)
				)}

				{side === "Left" &&
					Object.entries(tabData.dependencyGroupboxes || {}).map(([dependencyName, dependencyGroupbox]) => (
						<DependencyGroupboxRenderer
							key={`dep-gb-left-${dependencyName}`}
							dependencyGroupbox={dependencyGroupbox}
							scope={`gb:${tabData.name}:depgroup:${dependencyName}`}
							optionDefaults={optionDefaults}
						/>
					))}
			</TabColumn>
		);
	};

	const { warningBox } = tabData;

	return (
		<>
			{warningBox && (
				<ObsidianWarningBox text={warningBox.Text} title={warningBox.Title} visible={warningBox.Visible} isNormal={warningBox.IsNormal} lockSize={warningBox.LockSize} />
			)}

			<TabContainer>
				{renderSide("Left")}
				{renderSide("Right")}
			</TabContainer>
		</>
	);
};

TabParserComponent.displayName = "TabParser";
export const TabParser = memo(TabParserComponent);