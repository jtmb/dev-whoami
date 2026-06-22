"use client";

/**
 * Animated reveal — wraps children in a Framer Motion div that fades in
 * and slides up when scrolled into view. Uses the Intersection Observer
 * API via framer-motion's useInView hook.
 * Respects prefers-reduced-motion — skips animation entirely if user prefers reduced motion.
 */
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

/** Map direction names to y/x offsets for the animation. */
const directionOffsets: Record<string, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
};

/**
 * Scroll-triggered reveal animation.
 * If the user prefers reduced motion, renders children statically
 * without any animation.
 */
export function AnimatedReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimatedRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const offset = directionOffsets[direction] || directionOffsets.up;

  // Wait until client-side mount — useReducedMotion() returns null during SSR.
  // Rendering motion.div on server with inline styles then a plain div on
  // client (when reduced motion is true) causes a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // During SSR or before mount, render a static div matching the client outcome
  // when reduced motion is enabled (the common case for a11y-conscious users).
  if (!mounted || prefersReducedMotion) {
    return <div ref={ref} className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...offset }
      }
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
