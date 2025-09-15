import type { ReactNode } from "react";

export function TabContainer({ children }: { children: ReactNode }) {
    return (
        <div className="w-full flex flex-1 flex-col min-h-0 overflow-hidden">
            <div className="flex flex-row w-full overflow-hidden" style={{ minHeight: 0 }}>{children}</div>
        </div>
    );
}

export function TabLeft({ children }: { children: ReactNode }) {
    return (
        <div className="flex-1 pr-1 overflow-y-scroll no-scrollbar">
            {children}
        </div>
    );
}

export function TabRight({ children }: { children: ReactNode }) {
    return (
        <div className="flex-1 mr-2 overflow-y-scroll no-scrollbar">
            {children}
        </div>
    );
}
