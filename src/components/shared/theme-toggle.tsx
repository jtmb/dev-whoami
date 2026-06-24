"use client";

/**
 * ThemeToggle — reusable dark/light mode toggle button with animated icon transitions.
 * Uses next-themes for theme management and framer-motion for smooth sun/moon crossfade.
 * Handles hydration mismatch internally (mounted state) so consumers don't need to worry about it.
 */
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to avoid hydration mismatch with theme icon.
  // This is the canonical next-themes pattern — server renders nothing, client renders toggle.
  useEffect(() => setMounted(true), []);

  /** Toggle between dark and light themes. */
  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // During SSR / before mount: render a placeholder to maintain layout space.
  if (!mounted) {
    return (
      <button
        type="button"
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
        aria-label="Toggle theme"
        tabIndex={-1}
      >
        <span className="h-5 w-5" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {/* Animated icon container — crossfade between Sun and Moon */}
      <motion.div
        key={theme}
        className="relative h-5 w-5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-400" />
        )}
      </motion.div>
    </button>
  );
}