import React from "react";

export function useClickOutside(
	References: React.RefObject<HTMLElement | null>[],
	onOutside: () => void,
) {
	React.useEffect(() => {
		const Handler = (Event: PointerEvent) => {
			const Target = Event.target as Node;
			const Path = Event.composedPath();
			const IsInside = References.some((Reference) => {
				const ElementInstance = Reference.current;
				return ElementInstance ? ElementInstance.contains(Target) || Path.includes(ElementInstance) : false;
			});
			if (!IsInside) onOutside();
		};

		document.addEventListener("pointerdown", Handler, true);
		return () => document.removeEventListener("pointerdown", Handler, true);
	}, [References, onOutside]);
}