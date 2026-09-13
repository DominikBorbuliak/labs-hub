"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SpoilerProps = {
  children: React.ReactNode;
  label?: string;
};

export const Spoiler = ({
  children,
  label = "Click to reveal hidden content",
}: SpoilerProps) => {
  const [revealed, setRevealed] = useState(false);

  const toggle = () => setRevealed((v) => !v);

  return (
    <div className="relative mt-1 mb-4 rounded-lg">
      {!revealed ? (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={revealed}
          className="absolute inset-0 z-10 flex w-full flex-col items-center justify-center gap-2 rounded-lg cursor-pointer"
        >
          <EyeOff className="size-6 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-muted-foreground select-none">
            {label}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={revealed}
          aria-label="Hide content"
          className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-gray-700/60 hover:bg-gray-600/80 text-gray-300 hover:text-gray-100 cursor-pointer"
        >
          <Eye className="size-4" aria-hidden="true" />
        </button>
      )}
      <div
        className={cn(
          "transition-all duration-300 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          !revealed && "blur-md select-none pointer-events-none"
        )}
      >
        {children}
      </div>
    </div>
  );
};
