"use client";

import { Button as ButtonPrimitive } from "@/components/ui/button";
import { toast } from "sonner";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useMemo } from "react";

function CopyButton({ onClick }: { onClick: () => void }) {
  const [copied, setCopied] = useState(false);

  return useMemo(
    () => (
      <ButtonPrimitive
        size={"icon"}
        variant={"outline"}
        className="relative rounded-md px-2"
        onClick={() => {
          onClick();
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
      >
        <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
        <Copy
          className={`h-4 w-4 transition-all duration-300 ${
            copied ? "scale-0" : "scale-100"
          }`}
        />
        <Check
          className={`absolute inset-0 m-auto h-4 w-4 transition-all duration-300 ${
            copied ? "scale-100" : "scale-0"
          }`}
        />
      </ButtonPrimitive>
    ),
    [copied, onClick]
  );
}

export function CopyPseudoComponent({
  codegenfunc,
}: {
  codegenfunc: () => string;
}) {
  return (
    <div className="flex items-center justify-end px-2">
      <CopyButton
        onClick={() => {
          navigator.clipboard.writeText(codegenfunc());
          toast.success("Copied to clipboard pseudocode!");
        }}
      />
    </div>
  );
}
