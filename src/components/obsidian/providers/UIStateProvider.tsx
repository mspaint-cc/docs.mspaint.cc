"use client";

import React from "react";
import type { ReactNode } from "react";

type UIState = Record<string, unknown>;

type UIStateContextType = {
	state: Readonly<UIState>;
	setState: (key: string, value: unknown) => void;
	resetState: (prefix?: string) => void;

	subscribe: (key: string, callback: () => void) => () => void;
	get: (key: string) => unknown;
	getState: () => Readonly<UIState>;

	game: Readonly<string>;
	setGame: (newGame: string) => void;

	footerGame: Readonly<string>;
	setFooterGame: (newFooterGame: string) => void;
};

const UIStateContext = React.createContext<UIStateContextType | null>(null);

export function UIStateProvider({ children }: { children: ReactNode }) {
	const [state, setStateMap] = React.useState<UIState>({});
	const [game, setGame] = React.useState("DOORS - The Hotel");
	const [footerGame, setFooterGame] = React.useState("DOORS");

	const stateRef = React.useRef<UIState>({});
	const listenersRef = React.useRef<Map<string, Set<() => void>>>(new Map());

	const notify = React.useCallback((key: string) => {
		const listeners = listenersRef.current.get(key);
		if (!listeners) return;

		for (const listener of Array.from(listeners)) {
			try {
				listener();
			} catch (error) {
				if (process.env.NODE_ENV !== "production") console.error("[UIState.notify] listener threw:", error);
			}
		}
	}, []);

	const commitState = React.useCallback((nextState: UIState) => {
		stateRef.current = nextState;
		setStateMap(nextState);
	}, []);

	const setState = React.useCallback(
		(key: string, value: unknown) => {
			if (Object.is(stateRef.current[key], value)) return;

			commitState({ ...stateRef.current, [key]: value });
			notify(key);
		},
		[commitState, notify]
	);

	const resetState = React.useCallback(
		(prefix?: string) => {
			const nextState: UIState = {};
			if (prefix !== undefined) {
				for (const [key, value] of Object.entries(stateRef.current)) {
					if (!key.startsWith(prefix)) nextState[key] = value;
				}
			}

			commitState(nextState);
			for (const key of listenersRef.current.keys()) {
				if (prefix === undefined || key.startsWith(prefix)) notify(key);
			}
		},
		[commitState, notify]
	);

	const subscribe = React.useCallback((key: string, callback: () => void) => {
		let listeners = listenersRef.current.get(key);
		if (!listeners) {
			listeners = new Set();
			listenersRef.current.set(key, listeners);
		}

		listeners.add(callback);
		return () => {
			listeners.delete(callback);
			if (listeners.size === 0) listenersRef.current.delete(key);
		};
	}, []);

	const get = React.useCallback((key: string) => stateRef.current[key], []);
	const getState = React.useCallback(() => stateRef.current, []);

	const contextValue = React.useMemo(
		() => ({ state, setState, resetState, subscribe, get, getState, game, setGame, footerGame, setFooterGame }),
		[state, setState, resetState, subscribe, get, getState, game, footerGame]
	);

	return <UIStateContext.Provider value={contextValue}>{children}</UIStateContext.Provider>;
}

export function useUIState() {
	const context = React.useContext(UIStateContext);
	if (!context) throw new Error("useUIState must be used within UIStateProvider");
	return context;
}

export function useResetUIState() {
	return useUIState().resetState;
}

export function useUIValue<T = unknown>(
	key: string | undefined,
	initialValue?: T
): [T | undefined, (value: T | ((previous: T | undefined) => T)) => void] {
	const { setState, subscribe, get } = useUIState();

	const getSnapshot = React.useCallback(
		() => (key ? ((get(key) as T | undefined) ?? initialValue) : initialValue),
		[get, key, initialValue]
	);
	const getServerSnapshot = React.useCallback(() => initialValue, [initialValue]);
	const subscribeKey = React.useCallback((onStoreChange: () => void) => (key ? subscribe(key, onStoreChange) : () => {}), [subscribe, key]);

	const value = React.useSyncExternalStore(subscribeKey, getSnapshot, getServerSnapshot);

	const setValue = React.useCallback(
		(nextValue: T | ((previous: T | undefined) => T)) => {
			if (!key) return;

			const resolvedValue =
				typeof nextValue === "function"
					? (nextValue as (previous: T | undefined) => T)((get(key) as T | undefined) ?? initialValue)
					: nextValue;
			setState(key, resolvedValue);
		},
		[setState, key, get, initialValue]
	);

	return [value, setValue];
}

export function useElementValue<T>(stateKey: string | undefined, defaultValue: T): [T, (value: T) => void] {
	const [storedValue, setStoredValue] = useUIValue<T>(stateKey, defaultValue);
	const [localValue, setLocalValue] = React.useState<T>(defaultValue);
	const [previousDefault, setPreviousDefault] = React.useState<T>(defaultValue);

	if (!stateKey && !Object.is(previousDefault, defaultValue)) {
		setPreviousDefault(defaultValue);
		setLocalValue(defaultValue);
	}

	return stateKey ? [storedValue as T, setStoredValue] : [localValue, setLocalValue];
}