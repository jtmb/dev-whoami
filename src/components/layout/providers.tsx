"use client";

/**
 * Client-side providers wrapper.
 * ThemeProvider (next-themes) for dark/light mode.
 * TooltipProvider (shadcn/ui) for tooltip components.
 * Must be a client component since these providers use React context.
 */
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delay={300}>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
