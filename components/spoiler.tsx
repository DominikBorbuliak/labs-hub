"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SpoilerProps = {
  children: React.ReactNode;
  label?: string;
};

export const Spoiler = ({
  children,
  label = "Double-click to reveal hidden content",
}: SpoilerProps) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="relative my-4 rounded-lg"
      onDoubleClick={() => setRevealed((v) => !v)}
    >
      {!revealed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-lg">
          <EyeOff className="size-6 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground select-none">
            {label}
          </span>
        </div>
      )}
      <div
        className={cn(
          "transition-all duration-300 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          !revealed && "blur-md select-none pointer-events-none"
        )}
        aria-hidden={!revealed}
      >
        {children}
      </div>
    </div>
  );
};
