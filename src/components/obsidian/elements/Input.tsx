import React from "react";
import { ButtonBase } from "./Button";
import Label from "./Label";
import { useUIState } from "../providers/UIStateProvider";
import { cn } from "@/lib/utils";

export default function Input({
	text,
	value,
	placeholder,
	stateKey,
	className,
	containerClassName,
	inputClassName,
	onChanged,
	maxLength,
	clearTextOnFocus
}: {
	text: string;
	value: string;
	placeholder: string;
	stateKey?: string;
	className?: string;
	containerClassName?: string;
	inputClassName?: string;
	onChanged?: React.ChangeEventHandler<HTMLInputElement>;
	maxLength?: number;
	clearTextOnFocus?: boolean;
}) {
	const { state, setState } = useUIState();
	const [local, setLocal] = React.useState<string>((stateKey ? (state[stateKey] as string | undefined) : undefined) ?? value);

	React.useEffect(() => {
		if (!stateKey) return;
		const v = state[stateKey];
		if (typeof v === "string") setLocal(v);
	}, [state, stateKey]);

	React.useEffect(() => {
		if (stateKey) return;
		setLocal(value);
	}, [value, stateKey]);

	return (
		<div className="flex flex-col gap-1">
			{text ? <Label className="text-white opacity-100">{text}</Label> : null}

			<ButtonBase
				text={
					<input
						name="input"
						type="text"
						className={cn("w-full h-full text-white opacity-100 text-xs bg-transparent outline-none px-1", inputClassName)}
						value={local}
						placeholder={placeholder}
						maxLength={maxLength}
						onFocus={(e) => {
							if (clearTextOnFocus) {
								setLocal("");
								if (stateKey) setState(stateKey, "");
							}
							e.currentTarget.select?.();
						}}
						onChange={(e) => {
							let next = e.target.value;
							if (typeof maxLength === "number" && next.length > maxLength) {
								next = next.slice(0, maxLength);
							}
							setLocal(next);
							if (stateKey) setState(stateKey, next);
							if (onChanged) onChanged(e);
						}}
					/>
				}
				className={cn("text-left text-white opacity-100 m-1 text-xs", className)}
				containerClassName={cn("justify-start flex relative", containerClassName)}
				replacedText={true}
			/>
		</div>
	);
}
