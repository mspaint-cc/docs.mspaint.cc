import { cn } from "@/lib/utils";
import * as React from "react";
import type { ReactNode } from "react";
import { useCornerRadius } from "../providers/ObsidianDataProvider";

export const ButtonBase = React.forwardRef<
	HTMLButtonElement,
	{
		text: string | ReactNode;
		containerClassName?: string;
		className?: string;
		children?: ReactNode;
		replacedText?: boolean;
		centeredText?: boolean;
	} & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({
	text,
	containerClassName,
	className,
	children,
	replacedText = false,
	centeredText = false,
	...props
}, ref) => {
	const br = useCornerRadius();

	return (<div className={cn("flex w-full min-w-0 h-[24px] justify-center items-center", containerClassName)}>
		<button
			ref={ref}
			type="button"
			className={cn(
				"flex items-center w-full h-full cursor-pointer border bg-[rgb(25,25,25)] hover:bg-[rgb(35,35,35)] border-[rgb(40,40,40)] overflow-hidden",
				!replacedText && (centeredText ? "justify-center" : "justify-start px-2")
			)}
			style={{ borderRadius: br }}
			{...props}
		>
			{!replacedText ? (
				<span className={cn(
					"flex items-center w-full min-w-0 h-full text-white text-[12px] opacity-50 truncate",
					centeredText ? "justify-center text-center" : "justify-start text-left",
					className
				)}>
					{text}
				</span>
			) : (text)}

			{children}
		</button>
	</div>);
});

ButtonBase.displayName = "ButtonBase";

export default function Button({
	text,
	risky,
	subButton,
}: {
	text: string;
	risky?: boolean;
	subButton?: {
		text: string;
		properties: {
			risky?: boolean;
			doubleClick?: boolean;
		};
	};
}) {
	if (subButton != undefined) {
		return (
			<div className="flex flex-row items-center w-full gap-[0.35rem]">
				<ButtonBase
					text={text}
					containerClassName="flex-1"
					centeredText={true}
					className={risky ? "text-red-500 opacity-80" : undefined}
				/>

				<ButtonBase
					text={subButton.text}
					containerClassName="flex-1"
					centeredText={true}
					className={subButton.properties.risky ? "text-red-500 opacity-80" : undefined}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-row items-center w-full">
			<ButtonBase
				text={text}
				centeredText={true}
				className={risky ? "text-red-500 opacity-80" : undefined}
			/>
		</div>
	);
}