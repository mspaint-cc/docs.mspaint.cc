"use client";

import { FC, Fragment, useMemo, type ReactNode } from "react";
import { GroupboxData, TabboxData, UIElement } from "../element.types";
import { useUIState } from "../providers/UIStateProvider";
import { dependenciesMet, type OptionDefault } from "../utils/dependencies";
import { ElementParser } from "./ElementParser";
import Tabbox from "../elements/TabBox";

export const DependencyBoxRenderer: FC<{
	depBox: GroupboxData;
	scope: string;
	optionDefaults: Map<string, OptionDefault>;
}> = ({ depBox, scope, optionDefaults }) => {
	const { state } = useUIState();
	if (!dependenciesMet(depBox.dependencies, state, optionDefaults)) return null;

	return (
		<OrderedBoxContent
			elements={depBox.elements}
			dependencyBoxes={depBox.dependencyBoxes}
			scope={scope}
			optionDefaults={optionDefaults}
		/>
	);
};

export const OrderedBoxContent: FC<{
	elements?: UIElement[];
	tabboxes?: TabboxData[];
	dependencyBoxes?: { [key: string]: GroupboxData };
	scope: string;
	optionDefaults: Map<string, OptionDefault>;
}> = ({ elements, tabboxes, dependencyBoxes, scope, optionDefaults }) => {
	const items = useMemo(() => {
		const list: { order: number; tie: number; key: string; node: ReactNode }[] = [];

		(elements || []).forEach((element, index) => {
			list.push({
				order: element.layoutOrder ?? index,
				tie: index,
				key: `el-${element.index}`,
				node: <ElementParser element={element} stateKeyPrefix={scope} />
			});
		});

		Object.entries(dependencyBoxes || {}).forEach(([depName, depBox], index) => {
			list.push({
				order: depBox.layoutOrder ?? 10000 + index,
				tie: 10000 + index,
				key: `dep-${depName}`,
				node: (
					<DependencyBoxRenderer
						depBox={depBox}
						scope={`${scope}:dep:${depName}`}
						optionDefaults={optionDefaults}
					/>
				)
			});
		});

		(tabboxes || []).forEach((tabbox, index) => {
			list.push({
				order: tabbox.layoutOrder ?? 20000 + index,
				tie: 20000 + index,
				key: `tabbox-${tabbox.name}`,
				node: (
					<Tabbox
						tabs={tabbox.tabs}
						scope={`${scope}:tabbox:${tabbox.name}`}
						optionDefaults={optionDefaults}
						nested
					/>
				)
			});
		});

		list.sort((a, b) => a.order - b.order || a.tie - b.tie);
		return list;
	}, [elements, tabboxes, dependencyBoxes, scope, optionDefaults]);

	return (
		<>
			{items.map((item) => (
				<Fragment key={item.key}>{item.node}</Fragment>
			))}
		</>
	);
};
