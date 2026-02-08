"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [{ href: "/courses", label: "Courses" }];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/courses" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32" className="shrink-0">
            <rect width="32" height="32" rx="8" fill="#0f172a" />
            <path d="M12 6h8v2h-1v6l5 8.5c.6 1 .1 2.5-1.2 2.5H9.2c-1.3 0-1.8-1.5-1.2-2.5L13 14V8h-1V6z" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="19" r="1.2" fill="#60a5fa" />
            <circle cx="18" cy="21" r="1" fill="#60a5fa" />
            <circle cx="16" cy="17.5" r="0.8" fill="#60a5fa" />
          </svg>
          Labs Hub
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
