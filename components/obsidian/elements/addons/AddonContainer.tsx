import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function AddonContainer({
  children,
  className,
  innerClassName,
}: {
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={className}>
      <div
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center pointer-events-auto z-40",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
