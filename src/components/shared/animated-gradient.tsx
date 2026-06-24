"use client";

/**
 * Warp Speed Star Field — black background with stars streaking outward from center.
 * Only renders in dark mode. Respects prefers-reduced-motion (static stars).
 * SSR-safe: all window-dependent logic runs after mount via useEffect/state.
 */
import { useEffect, useRef, useState } from "react";

const STAR_COUNT = 200;

/** Deterministic PRNG seeded by a fixed value — same stars every render. */
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 1) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function AnimatedGradient() {
  const [isDark, setIsDark] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Detect theme — runs after mount only.
  useEffect(() => {
    const checkTheme = () => document.documentElement.classList.contains("dark");
    setIsDark(checkTheme());

    if ("MutationObserver" in window) {
      const observer = new MutationObserver(() => setIsDark(checkTheme()));
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    }
  }, []);

  // Canvas warp-speed animation — only when dark mode is active.
  useEffect(() => {
    if (!isDark) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    interface Star3D {
      x: number;   // world X offset from center
      y: number;   // world Y offset from center
      z: number;   // depth: 0 = on screen, 1000 = far away
      baseSize: number;
      opacity: number;
    }

    let stars: Star3D[] = [];

    const initStars = () => {
      const w = canvas.width;
      const h = canvas.height;
      const rng = createRng(42);

      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: (rng() - 0.5) * w * 3,
        y: (rng() - 0.5) * h * 3,
        z: rng() * 1000,
        baseSize: Math.max(0.5, rng() * 2),
        opacity: 0.2 + rng() * 0.8,
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Black background
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        if (!prefersReducedMotion) {
          // Speed increases as star gets closer — exponential warp effect
          const speedFactor = Math.pow(star.z / 1000, -2.5);
          star.z -= dt * 0.8 * speedFactor;

          if (star.z <= 0) {
            const rng = createRng(Math.floor(star.z));
            star.z = 1000 + Math.random() * 200;
            star.x = (rng() - 0.5) * w * 3;
            star.y = (rng() - 0.5) * h * 3;
          }
        }

        // Perspective projection: focal length determines field of view.
        const focalLength = 400;
        const perspective = focalLength / (star.z + focalLength);
        const screenX = cx + star.x * perspective;
        const screenY = cy + star.y * perspective;

        // Skip stars outside viewport
        if (screenX < -50 || screenX > w + 50 || screenY < -50 || screenY > h + 50) continue;

        const size = Math.max(0.3, star.baseSize * perspective);
        const alpha = star.opacity * Math.min(1, perspective);

        if (!prefersReducedMotion && star.z < 800) {
          // Warp streak: draw from previous position to current position.
          // As star approaches, the streak grows dramatically — classic hyperspace look.
          const prevZ = star.z + dt * 0.8 * Math.pow(star.z / 1000, -2.5);
          if (prevZ > 0) {
            const prevPerspective = focalLength / (prevZ + focalLength);
            const prevScreenX = cx + star.x * prevPerspective;
            const prevScreenY = cy + star.y * prevPerspective;

            // Streak length grows with perspective — near stars have long streaks.
            const streakLen = Math.sqrt(
              (screenX - prevScreenX) ** 2 + (screenY - prevScreenY) ** 2,
            );

            if (streakLen > 1) {
              // Draw tapered streak: thick at head, thin at tail.
              const angle = Math.atan2(screenY - prevScreenY, screenX - prevScreenX);
              const headWidth = size * 0.8;
              const tailWidth = Math.max(0.3, size * 0.15);

              // Streak gradient: bright at head, fading toward tail.
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(screenX + Math.cos(angle + Math.PI / 2) * headWidth, screenY - Math.sin(angle + Math.PI / 2) * headWidth);
              ctx.lineTo(prevScreenX + Math.cos(angle + Math.PI / 2) * tailWidth, prevScreenY - Math.sin(angle + Math.PI / 2) * tailWidth);
              ctx.lineTo(prevScreenX - Math.cos(angle + Math.PI / 2) * tailWidth, prevScreenY + Math.sin(angle + Math.PI / 2) * tailWidth);
              ctx.lineTo(screenX - Math.cos(angle + Math.PI / 2) * headWidth, screenY + Math.sin(angle + Math.PI / 2) * headWidth);
              ctx.closePath();

              const grad = ctx.createLinearGradient(prevScreenX, prevScreenY, screenX, screenY);
              grad.addColorStop(0, `rgba(180, 200, 255, ${alpha * 0.3})`);
              grad.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);
              ctx.fillStyle = grad;
              ctx.fill();
              ctx.restore();
            }
          }
        }

        // Draw the star dot at head of streak.
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Glow on bright stars.
        if (size > 1.5 && alpha > 0.6) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
          const glowGrad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 3);
          glowGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.4})`);
          glowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  // Skip entirely in light mode — renders nothing.
  if (!isDark) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
