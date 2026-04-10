import type { ReactNode } from "react";
import { useCornerRadius } from "../providers/ObsidianDataProvider";

export function Groupbox({ icon: Icon, title, children }: { icon?: React.ElementType, title: string, children: ReactNode }) {
    const br = useCornerRadius();
    return (
        <div
            className="mt-1 ml-2 mb-3 bg-[rgb(15,15,15)] border border-[rgb(40,40,40)] relative font-normal"
            style={{ borderRadius: br }}
        >
            {/* Top Bar */}
            <div className="w-full h-[38px] flex flex-row bg-[rgb(15,15,15)]" style={{ borderRadius: br }}>
                {/* Title */}
                <div className="flex flex-row items-center w-full border-b border-b-[rgb(40,40,40)]">
                    {Icon && (<Icon className="text-[rgb(125,85,255)] h-full ml-2 mr-[-5px]" />)}
                    <span className="text-white text-[14px] ml-3 mt-1">{title}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col right p-[0.35rem] pb-2 gap-[0.35rem] min-h-0">
                {children}
            </div>
        </div>
    )
}