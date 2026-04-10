import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function AddonContainer({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("absolute right-0 top-1/2 -translate-y-1/2 flex flex-row items-center space-x-1 shrink-0 z-40", className)}>
      {children}
    </div>
  );
}