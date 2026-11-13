import React from "react";

export const PortalContainerContext = React.createContext<HTMLElement | null>(null);

export function usePortalContainer() {
	const portalContainer = React.useContext(PortalContainerContext);
	return typeof document === "undefined" ? null : (portalContainer ?? document.body);
}

export function useClickOutside(references: React.RefObject<HTMLElement | null>[], onOutside: () => void) {
	React.useEffect(() => {
		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target as Node;
			const path = event.composedPath();
			const isInside = references.some((reference) => {
				const element = reference.current;
				return element ? element.contains(target) || path.includes(element) : false;
			});

			if (!isInside) onOutside();
		};

		document.addEventListener("pointerdown", handlePointerDown, true);
		return () => document.removeEventListener("pointerdown", handlePointerDown, true);
	}, [references, onOutside]);
}

export type AnchorRect = { left: number; top: number; bottom: number; width: number };

export function useAnchoredRect(anchorRef: React.RefObject<HTMLElement | null>, isOpen: boolean) {
	const [anchorRect, setAnchorRect] = React.useState<AnchorRect>({ left: 0, top: 0, bottom: 0, width: 0 });

	React.useLayoutEffect(() => {
		if (!isOpen) return;

		const updateRect = () => {
			if (!anchorRef.current) return;

			const { left, top, bottom, width } = anchorRef.current.getBoundingClientRect();
			setAnchorRect({ left, top, bottom, width });
		};

		const rootNode = anchorRef.current?.getRootNode();
		const shadowRoot = rootNode instanceof ShadowRoot ? rootNode : null;

		updateRect();
		window.addEventListener("scroll", updateRect, true);
		window.addEventListener("resize", updateRect);
		shadowRoot?.addEventListener("scroll", updateRect, true);
		return () => {
			window.removeEventListener("scroll", updateRect, true);
			window.removeEventListener("resize", updateRect);
			shadowRoot?.removeEventListener("scroll", updateRect, true);
		};
	}, [anchorRef, isOpen]);

	return anchorRect;
}