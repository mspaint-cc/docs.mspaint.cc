import { cn } from "@/lib/utils";
import * as React from "react";
import type { ReactNode } from "react";
import { useHalfCornerRadius } from "../providers/ObsidianDataProvider";
import { renderIcon } from "../utils/icons";
import { renderAddonItems } from "../ui/renderAddons";
import type { Addons } from "../element.types";
import Label from "./Label";

export const ButtonBase = React.forwardRef<
	HTMLButtonElement,
	{ containerClassName?: string; children?: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ containerClassName, className, children, style, ...props }, ref) => {
	const halfCornerRadius = useHalfCornerRadius();

	return (
		<div className={cn("flex w-full min-w-0 h-[21px] justify-center items-center", containerClassName)}>
			<button
				ref={ref}
				type="button"
				className={cn(
					"group/button box-border flex items-center w-full h-full cursor-pointer border overflow-hidden leading-none",
					props.disabled ? "pointer-events-none bg-[var(--background-color)] border-[color-mix(in_srgb,var(--outline-color)_50%,transparent)]" : "bg-[var(--main-color)] border-[var(--outline-color)]",
					className
				)}
				style={{
					borderTopLeftRadius: halfCornerRadius,
					borderTopRightRadius: halfCornerRadius,
					borderBottomLeftRadius: halfCornerRadius,
					borderBottomRightRadius: halfCornerRadius,
					...style
				}}
				{...props}
			>
				{children}
			</button>
		</div>
	);
});

ButtonBase.displayName = "ButtonBase";

export function ButtonText({
	icon,
	disabled,
	className,
	children
}: {
	icon?: string;
	disabled?: boolean;
	className?: string;
	children?: ReactNode;
}) {
	return (
		<span
			className={cn(
				"flex items-center w-full min-w-0 h-full text-white text-[14px] opacity-60 group-hover/button:opacity-100 transition-opacity truncate gap-[6px]",
				disabled && "opacity-20 group-hover/button:opacity-20",
				className
			)}
		>
			{renderIcon(icon, "size-3.5 shrink-0 object-contain")}
			{children}
		</span>
	);
}

type ButtonProperties = { text: string; icon?: string; risky?: boolean; addons?: Addons[]; index?: string | number };

export default function Button({
	text,
	icon,
	risky,
	subButton,
	disabled,
	addons,
	index,
	stateKeyPrefix
}: {
	text: string;
	icon?: string;
	risky?: boolean;
	subButton?: {
		text: string;
		icon?: string;
		index?: string | number;
		properties?: {
			risky?: boolean;
			doubleClick?: boolean;
			icon?: string;
			addons?: Addons[];
		};
		risky?: boolean;
	};
	disabled?: boolean;
	addons?: Addons[];
	index?: string | number;
	stateKeyPrefix?: string;
}) {
	const buttons: ButtonProperties[] = [{ text, icon, risky, addons, index: index ?? "button" }];
	if (subButton) {
		buttons.push({
			text: subButton.text,
			icon: subButton.icon ?? subButton.properties?.icon,
			risky: subButton.properties?.risky ?? subButton.risky,
			addons: subButton.properties?.addons,
			index: subButton.index ?? `${index ?? "button"}_Sub`
		});
	}

	return (
		<div className="flex flex-row items-center w-full gap-[6px]">
			{buttons.map((button, buttonIndex) => (
				<div key={buttonIndex} className="flex flex-1 min-w-0 flex-row items-center gap-[6px] h-[21px]">
					<ButtonBase
						containerClassName="flex-1"
						className={cn("justify-center", button.risky && "text-[var(--red-color)]")}
						disabled={disabled}
					>
						<ButtonText icon={button.icon} disabled={disabled} className={cn("justify-center text-center", button.risky && "text-inherit")}>
							<Label className="w-auto text-inherit truncate" doesWrap={false}>
								{button.text}
							</Label>
						</ButtonText>
					</ButtonBase>
					{renderAddonItems(button.index ?? buttonIndex, button.addons, stateKeyPrefix, "outline-offset-[-1px]")}
				</div>
			))}
		</div>
	);
}