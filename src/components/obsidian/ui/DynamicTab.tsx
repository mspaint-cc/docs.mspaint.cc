import { memo, useMemo, FC } from "react";

import { TabData, TabboxData, GroupboxData } from "../element.types";
import { Groupbox } from "../elements/GroupBox";
import { TabContainer, TabLeft, TabRight } from "../elements/Tab";
import Tabbox from "../elements/TabBox";
import ObsidianWarningBox from "../elements/WarningBox";
import { ElementParser } from "./ElementParser";
import { OrderedBoxContent } from "./DependencyBox";
import { collectOptionDefaults, dependenciesMet, type OptionDefault } from "../utils/dependencies";
import { useUIState } from "../providers/UIStateProvider";
import { useCornerRadius } from "../providers/ObsidianDataProvider";

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

			{[...(groupbox.dependencyGroupboxes || [])]
				.sort((depA, depB) => (depA.layoutOrder ?? 0) - (depB.layoutOrder ?? 0))
				.map((depGroupbox) => (
					<DependencyGroupboxRenderer
						key={`depgroup-${depGroupbox.name}`}
						depGroupbox={depGroupbox}
						scope={`${scope}:depgroup:${depGroupbox.name}`}
						optionDefaults={optionDefaults}
					/>
				))}
		</>
	);
};

const DependencyGroupboxRenderer: FC<{
	depGroupbox: GroupboxData;
	scope: string;
	optionDefaults: Map<string, OptionDefault>;
}> = ({ depGroupbox, scope, optionDefaults }) => {
	const { state } = useUIState();
	const br = useCornerRadius();
	if (!dependenciesMet(depGroupbox.dependencies, state, optionDefaults)) return null;

	return (
		<div
			className="-mt-[6px] ml-2 mb-3 flex flex-col p-[7px] gap-[8px] bg-[var(--background-color)] border border-[var(--outline-color)] font-normal"
			style={{ borderRadius: br }}
		>
			<OrderedBoxContent
				elements={depGroupbox.elements}
				tabboxes={depGroupbox.tabboxes}
				dependencyBoxes={depGroupbox.dependencyBoxes}
				scope={scope}
				optionDefaults={optionDefaults}
			/>
		</div>
	);
};

const TabParserComponent: FC<{ tabData: TabData | null }> = ({ tabData }) => {
	const { groupboxes, tabboxes, warningBox, isKeyTab, elements, dependencyGroupboxes } = tabData || {};
	const optionDefaults = useMemo(() => collectOptionDefaults(tabData), [tabData]);

	const LeftBoxes = useMemo(() => {
		const GroupboxesList = groupboxes?.Left ? Object.values(groupboxes.Left) : [];
		const TabboxesList = tabboxes?.Left ? Object.values(tabboxes.Left) : [];
		return [...GroupboxesList, ...TabboxesList].sort((boxA, boxB) => (boxA.order ?? 0) - (boxB.order ?? 0));
	}, [groupboxes?.Left, tabboxes?.Left]);

	const RightBoxes = useMemo(() => {
		const GroupboxesList = groupboxes?.Right ? Object.values(groupboxes.Right) : [];
		const TabboxesList = tabboxes?.Right ? Object.values(tabboxes.Right) : [];
		return [...GroupboxesList, ...TabboxesList].sort((boxA, boxB) => (boxA.order ?? 0) - (boxB.order ?? 0));
	}, [groupboxes?.Right, tabboxes?.Right]);

	if (!tabData) return null;

	if (isKeyTab) {
		return (
			<div className="flex flex-col items-center justify-center gap-[8px] w-full h-full px-4 py-6 overflow-y-auto">
				{(elements || []).map((element) => (
					<div key={`keytab-${element.index}`} className="w-full max-w-[420px]">
						<ElementParser element={element} stateKeyPrefix={`keytab:${tabData.name}`} />
					</div>
				))}
			</div>
		);
	}

	return (
		<>
			{warningBox && (
				<ObsidianWarningBox
					text={warningBox.Text}
					title={warningBox.Title}
					visible={warningBox.Visible}
					isNormal={warningBox.IsNormal}
					lockSize={warningBox.LockSize}
				/>
			)}

			<TabContainer>
				<TabLeft>
					{LeftBoxes.map((Box) => {
						if (Box.type === "Tabbox") {
							const TabboxInstance = Box as TabboxData;
							return (
								<Tabbox
									key={TabboxInstance.name}
									tabs={TabboxInstance.tabs}
									scope={`tab:${tabData.name}:left:tabbox:${TabboxInstance.name}`}
									optionDefaults={optionDefaults}
								/>
							);
						}

						const GroupboxInstance = Box as GroupboxData;
						return (
							<GroupboxRenderer
								key={GroupboxInstance.name}
								groupbox={GroupboxInstance}
								scope={`gb:${tabData.name}:left:groupbox:${GroupboxInstance.name}`}
								optionDefaults={optionDefaults}
							/>
						);
					})}

					{Object.entries(dependencyGroupboxes || {}).map(([depName, depGroupbox]) => (
						<DependencyGroupboxRenderer
							key={`dep-gb-left-${depName}`}
							depGroupbox={depGroupbox}
							scope={`gb:${tabData.name}:depgroup:${depName}`}
							optionDefaults={optionDefaults}
						/>
					))}
				</TabLeft>

				<TabRight>
					{RightBoxes.map((Box) => {
						if (Box.type === "Tabbox") {
							const TabboxInstance = Box as TabboxData;
							return (
								<Tabbox
									key={TabboxInstance.name}
									tabs={TabboxInstance.tabs}
									scope={`tab:${tabData.name}:right:tabbox:${TabboxInstance.name}`}
									optionDefaults={optionDefaults}
								/>
							);
						}

						const GroupboxInstance = Box as GroupboxData;
						return (
							<GroupboxRenderer
								key={GroupboxInstance.name}
								groupbox={GroupboxInstance}
								scope={`gb:${tabData.name}:right:groupbox:${GroupboxInstance.name}`}
								optionDefaults={optionDefaults}
							/>
						);
					})}
				</TabRight>
			</TabContainer>
		</>
	);
};

TabParserComponent.displayName = "TabParser";
export const TabParser = memo(TabParserComponent);
