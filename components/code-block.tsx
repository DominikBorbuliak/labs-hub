"use client";

import { useCallback, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export const CodeBlock = ({
  className,
  ...props
}: React.ComponentProps<"pre">) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = preRef.current?.textContent ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div className="relative group mb-4">
      <pre
        ref={preRef}
        className={cn(
          "bg-[#0d1117]! text-gray-100! p-3 rounded-lg overflow-x-auto border-0 mb-0!",
          className
        )}
        {...props}
      />
      <Button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/60 hover:bg-gray-600/80 text-gray-300 hover:text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Copy code"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
};
