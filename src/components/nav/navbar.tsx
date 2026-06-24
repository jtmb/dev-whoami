"use client";

/**
 * Main navigation bar — sticky header with desktop links and mobile sheet drawer.
 * Uses shadcn/ui Sheet for the mobile menu and next-themes for dark mode toggle.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GitHubIcon } from "@/components/shared/github-icon";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { mainNavLinks } from "@/data/nav";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  /** Check if a nav link is the current active route. */
  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight transition-colors hover:text-primary"
        >
          <span className="text-xl">⚡</span>
          <span className="hidden sm:inline">jtmb</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {mainNavLinks.map((link) => (
            <Button
              key={link.href}
              variant={isActive(link.href) ? "secondary" : "ghost"}
              size="sm"
              nativeButton={false}
              render={<Link href={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </div>

        {/* Right side: theme toggle + GitHub + mobile menu */}
        <div className="flex items-center gap-2">
          {/* Theme toggle — handles hydration mismatch internally */}
          <ThemeToggle />

          {/* GitHub link */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="GitHub profile"
            nativeButton={false}
            render={
              <a
                href="https://github.com/jtmb"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <GitHubIcon className="h-5 w-5" />
          </Button>

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="md:hidden"
              render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <nav className="flex flex-col gap-2">
                {mainNavLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant={isActive(link.href) ? "secondary" : "ghost"}
                    className="justify-start text-lg"
                    render={<Link href={link.href} />}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
