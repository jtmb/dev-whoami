"use client";

/**
 * Scroll progress indicator — a fixed-position bar at the top of the viewport
 * that fills proportionally as the user scrolls through the page content.
 * Uses Framer Motion for smooth width transitions.
 * Respects prefers-reduced-motion — shows static width when animations are disabled.
 */
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollProgressProps {
  /** Optional container to track scroll on (defaults to window). */
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function ScrollProgress({ containerRef }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const target = containerRef?.current ?? window;
    const getScrollProgress = (): number => {
      if (containerRef && containerRef.current) {
        const el = containerRef.current;
        // HTMLElement uses scrollTop / scrollHeight / clientHeight
        return el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      }
      // Window-based scroll
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      return scrollY / (docHeight - viewportHeight || 1);
    };

    const handleScroll = () => {
      setProgress(Math.min(getScrollProgress(), 1));
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    target.addEventListener("scroll", throttledHandler, { passive: true });
    // Initial measurement
    handleScroll();

    return () => {
      target.removeEventListener("scroll", throttledHandler);
    };
  }, [containerRef]);

  // When reduced motion is preferred, render a static div instead of animated motion.div
  if (prefersReducedMotion) {
    return (
      <div
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
        className="fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent"
      >
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    );
  }

  return (
    <motion.div
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent"
    >
      <motion.div
        className="h-full bg-primary"
        style={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />
    </motion.div>
  );
}