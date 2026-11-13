import React from "react";
import { ButtonBase } from "./Button";
import Label from "./Label";
import { useElementValue } from "../providers/UIStateProvider";
import { cn } from "@/lib/utils";

export default function Input({
	text,
	value,
	placeholder,
	stateKey,
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
	containerClassName?: string;
	inputClassName?: string;
	onChanged?: React.ChangeEventHandler<HTMLInputElement>;
	maxLength?: number;
	clearTextOnFocus?: boolean;
}) {
	const [currentValue, setCurrentValue] = useElementValue(stateKey, value);

	return (
		<div className="flex flex-col gap-1">
			{text ? <Label className="text-white opacity-100 leading-[14px]">{text}</Label> : null}

			<ButtonBase containerClassName={cn("justify-start flex relative", containerClassName)}>
				<input
					name="input"
					type="text"
					className={cn("w-full h-full text-white opacity-100 text-[14px] bg-transparent outline-none px-[8px] placeholder:opacity-50", inputClassName)}
					value={typeof currentValue === "string" ? currentValue : value}
					placeholder={placeholder}
					maxLength={maxLength}
					onFocus={(event) => {
						if (clearTextOnFocus) setCurrentValue("");
						event.currentTarget.select?.();
					}}
					onChange={(event) => {
						setCurrentValue(typeof maxLength === "number" ? event.target.value.slice(0, maxLength) : event.target.value);
						onChanged?.(event);
					}}
				/>
			</ButtonBase>
		</div>
	);
}