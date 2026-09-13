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
      className="relative mt-1 mb-4 rounded-lg"
      onDoubleClick={() => setRevealed((v) => !v)}
    >
      {!revealed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-lg">
          <EyeOff className="size-6 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-muted-foreground select-none">
            {label}
          </span>
        </div>
      )}
      {/*
        Content is intentionally not aria-hidden/pointer-events-none:
        keyboard and screen-reader users can always reach and read it,
        even while it's visually blurred for sighted mouse users who
        haven't double-clicked to reveal it yet.
      */}
      <div
        className={cn(
          "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          !revealed && "blur-md"
        )}
      >
        {children}
      </div>
    </div>
  );
};
