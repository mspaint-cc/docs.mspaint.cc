import { cn } from "@/lib/utils";
import * as React from "react";
import type { ReactNode } from "react";
import { useHalfCornerRadius } from "../providers/ObsidianDataProvider";
import { getIcon, resolveCustomIconSrc } from "../utils/icons";

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
	const IconComponent = getIcon(icon);
	const customIconSrc = IconComponent ? null : resolveCustomIconSrc(icon);

	return (
		<span
			className={cn(
				"flex items-center w-full min-w-0 h-full text-white text-[14px] opacity-60 group-hover/button:opacity-100 transition-opacity truncate gap-[6px]",
				disabled && "opacity-20 group-hover/button:opacity-20",
				className
			)}
		>
			{IconComponent ? (
				React.createElement(IconComponent, { className: "size-3.5 shrink-0" })
			) : customIconSrc ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={customIconSrc} alt="" className="size-3.5 shrink-0 object-contain" />
			) : null}
			{children}
		</span>
	);
}

type ButtonProperties = { text: string; icon?: string; risky?: boolean };

export default function Button({
	text,
	icon,
	risky,
	subButton,
	disabled
}: {
	text: string;
	icon?: string;
	risky?: boolean;
	subButton?: {
		text: string;
		icon?: string;
		properties?: {
			risky?: boolean;
			doubleClick?: boolean;
			icon?: string;
		};
		risky?: boolean;
	};
	disabled?: boolean;
}) {
	const buttons: ButtonProperties[] = [{ text, icon, risky }];
	if (subButton) {
		buttons.push({
			text: subButton.text,
			icon: subButton.icon ?? subButton.properties?.icon,
			risky: subButton.properties?.risky ?? subButton.risky
		});
	}

	return (
		<div className={cn("flex flex-row items-center w-full", subButton && "gap-[6px]")}>
			{buttons.map((button, buttonIndex) => (
				<ButtonBase
					key={buttonIndex}
					containerClassName={subButton ? "flex-1" : undefined}
					className={cn("justify-center", button.risky && "text-[var(--red-color)]")}
					disabled={disabled}
				>
					<ButtonText icon={button.icon} disabled={disabled} className={cn("justify-center text-center", button.risky && "text-inherit")}>
						{button.text}
					</ButtonText>
				</ButtonBase>
			))}
		</div>
	);
}