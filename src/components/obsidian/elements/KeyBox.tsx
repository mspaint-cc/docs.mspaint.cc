"use client";

import React from "react";
import { useCornerRadius } from "../providers/ObsidianDataProvider";
import { useUIValue } from "../providers/UIStateProvider";
import { cn } from "@/lib/utils";

export default function KeyBox({
	placeholder = "Key",
	value = "",
	stateKey
}: {
	placeholder?: string;
	value?: string;
	stateKey?: string;
}) {
	const br = useCornerRadius();
	const [stored, setStored] = useUIValue<string>(stateKey, value);
	const [local, setLocal] = React.useState(stored ?? value);

	React.useEffect(() => {
		if (typeof stored === "string") setLocal(stored);
	}, [stored]);

	return (
		<div className="w-[75%] max-w-full mx-auto flex flex-row items-stretch gap-0 h-[21px]">
			<input
				type="text"
				value={local}
				placeholder={placeholder}
				className={cn(
					"flex-1 min-w-0 h-full px-2 text-[14px] text-left outline-none border",
					"bg-[var(--main-color)] text-[var(--font-color)] placeholder:opacity-40"
				)}
				style={{
					borderRadius: br,
					borderColor: "var(--outline-color)"
				}}
				onChange={(event) => {
					const next = event.target.value;
					setLocal(next);
					if (stateKey) setStored(next);
				}}
			/>

			<button
				type="button"
				className={cn(
					"ml-[8px] w-[63px] h-full text-[14px] border shrink-0",
					"bg-[var(--main-color)] text-[var(--font-color)] opacity-60 hover:opacity-100"
				)}
				style={{
					borderRadius: br,
					borderColor: "var(--outline-color)"
				}}
			>
				Execute
			</button>
		</div>
	);
}
