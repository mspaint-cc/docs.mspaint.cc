import { cn } from "@/lib/utils";
import * as React from "react";
import type { ReactNode } from "react";
import { useCornerRadius } from "../providers/ObsidianDataProvider";
import { getIcon } from "../Window";

function resolveCustomIconSrc(icon?: string) {
	if (!icon) return null;

	const assetId = icon.match(/rbxassetid:\/\/(\d+)/i)?.[1] || (/^\d+$/.test(icon) ? icon : null);
	if (assetId) return `https://www.roblox.com/asset-thumbnail/image?assetId=${assetId}&width=150&height=150&format=png`;
	if (icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/")) return icon;

	return null;
}

export const ButtonBase = React.forwardRef<
	HTMLButtonElement,
	{
		text: string | ReactNode;
		icon?: string;
		containerClassName?: string;
		className?: string;
		children?: ReactNode;
		replacedText?: boolean;
		centeredText?: boolean;
	} & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ text, icon, containerClassName, className, children, replacedText = false, centeredText = false, style, ...props }, ref) => {
	const br = useCornerRadius();
	const IconComponent = getIcon(icon);
	const customIconSrc = IconComponent ? null : resolveCustomIconSrc(icon);

	return (
		<div className={cn("flex w-full min-w-0 h-[23px] justify-center items-center", containerClassName)}>
			<button
				ref={ref}
				type="button"
				className={cn(
					"box-border flex items-center w-full h-full cursor-pointer border hover:brightness-125 overflow-hidden leading-none",
					!replacedText && (centeredText ? "justify-center" : "justify-start px-2"),
					props.disabled && "pointer-events-none opacity-50"
				)}
				style={{
					borderTopLeftRadius: br,
					borderTopRightRadius: br,
					borderBottomLeftRadius: br,
					borderBottomRightRadius: br,
					backgroundColor: props.disabled ? "var(--background-color)" : "var(--main-color)",
					borderColor: "var(--outline-color)",
					...style
				}}
				{...props}
			>
				{!replacedText ? (
					<span
						className={cn(
							"flex items-center w-full min-w-0 h-full text-white text-[12px] opacity-50 truncate gap-1.5",
							centeredText ? "justify-center text-center" : "justify-start text-left",
							props.disabled && "opacity-20",
							className
						)}
					>
						{IconComponent ? (
							<IconComponent className="size-3.5 shrink-0" />
						) : customIconSrc ? (
							<img src={customIconSrc} alt="" className="size-3.5 shrink-0 object-contain" />
						) : null}
						{text}
					</span>
				) : (
					text
				)}

				{children}
			</button>
		</div>
	);
});

ButtonBase.displayName = "ButtonBase";

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
	if (subButton != undefined) {
		return (
			<div className="flex flex-row items-center w-full gap-[0.35rem]">
				<ButtonBase
					text={text}
					icon={icon}
					containerClassName="flex-1"
					centeredText={true}
					className={risky ? "text-red-500 opacity-80" : undefined}
					disabled={disabled}
				/>

				<ButtonBase
					text={subButton.text}
					icon={subButton.icon ?? subButton.properties?.icon}
					containerClassName="flex-1"
					centeredText={true}
					className={(subButton.properties?.risky ?? subButton.risky) ? "text-red-500 opacity-80" : undefined}
					disabled={disabled}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-row items-center w-full">
			<ButtonBase
				text={text}
				icon={icon}
				centeredText={true}
				className={risky ? "text-red-500 opacity-80" : undefined}
				disabled={disabled}
			/>
		</div>
	);
}
