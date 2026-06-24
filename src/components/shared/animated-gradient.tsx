"use client";

/**
 * Star field background — renders animated stars during dark mode for a
 * "traveling through space" effect. In light mode, the component is invisible
 * (renders nothing) to keep the clean white background.
 *
 * Pure CSS approach: stars are generated as pseudo-element-like divs with
 * randomized positions via inline styles. The warp animation uses CSS keyframes
 * for zero JS runtime overhead after mount.
 *
 * Respects prefers-reduced-motion by disabling all star animations.
 */
import { useId, useEffect, useState } from "react";

/** Number of stars to render in the field. */
const STAR_COUNT = 80;

/**
 * Generate deterministic pseudo-random positions for a seed.
 * Uses a simple mulberry32 PRNG so stars stay consistent across renders.
 */
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/** Star configuration: position, size, opacity, animation delay. */
interface StarConfig {
  top: number;
  left: number;
  size: number;
  opacity: number;
  delay: number;
}

/** Pre-generate star positions from a deterministic seed. */
function generateStars(count: number, seed: number): StarConfig[] {
  const rand = createSeededRandom(seed);
  return Array.from({ length: count }, () => ({
    top: rand() * 100,
    left: rand() * 100,
    size: 1 + rand() * 2, // 1-3px stars
    opacity: 0.2 + rand() * 0.8,
    delay: rand() * 8,
  }));
}

/**
 * Renders a star field background that activates only in dark mode.
 * Stars twinkle and drift with a subtle warp effect. In light mode,
 * the component renders nothing to preserve the clean white bg.
 */
export function AnimatedGradient() {
  const id = useId();
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode via .dark class on <html> (next-themes pattern)
  useEffect(() => {
    const check = () => document.documentElement.classList.contains("dark");
    setIsDark(check());
    const observer = new MutationObserver(() => setIsDark(check()));
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Skip rendering entirely in light mode
  if (!isDark) {
    return null;
  }

  const seedHash = id.split(":").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const stars = generateStars(STAR_COUNT, seedHash);

  return (
    <>
      <style>{`
        /* ── Star base styles ── */
        .star-field-${id} {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }

        .star-${id} {
          position: absolute;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 2px rgba(255, 255, 255, 0.4);
        }

        /* ── Twinkle animation ── */
        @keyframes star-twinkle-${id} {
          0%, 100% { opacity: var(--star-opacity); transform: scale(1); }
          50% { opacity: calc(var(--star-opacity) * 0.3); transform: scale(0.8); }
        }

        /* ── Subtle drift animation (warp effect) ── */
        @keyframes star-drift-${id} {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }

        .star-animated-${id} {
          animation:
            star-twinkle-${id} calc(3s + var(--star-delay) * 2) ease-in-out infinite,
            star-drift-${id} calc(15s + var(--star-delay) * 3) linear infinite;
          animation-delay: var(--star-delay)s;
        }

        /* ── Reduced motion — static stars, no animation ── */
        @media (prefers-reduced-motion: reduce) {
          .star-animated-${id} {
            animation: none !important;
            opacity: var(--star-opacity);
          }
        }
      `}</style>
      <div className={`star-field-${id}`} aria-hidden="true">
        {stars.map((star, i) => (
          <div
            key={i}
            className={`star-${id} star-animated-${id}`}
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              "--star-opacity": star.opacity,
              "--star-delay": star.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}