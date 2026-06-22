"use client";

/**
 * Hero section — full-viewport intro with animated typewriter taglines,
 * stats bar, and CTAs. Uses client component for the typewriter animation.
 * GitHub profile data is fetched server-side and passed as props.
 * Respects prefers-reduced-motion — disables typewriter animation.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/shared/gradient-text";
import { GitHubIcon } from "@/components/shared/github-icon";

/** Rotating taglines for the typewriter effect. */
const TAGLINES = [
  "Automating infrastructure.",
  "Self-hosting everything.",
  "Building on Kubernetes.",
  "Shipping with Docker.",
  "Orchestrating with Ansible.",
];

interface HeroProps {
  repos: number;
  stars: number;
  topLanguages: string[];
}

export function Hero({ repos, stars, topLanguages }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Wait until client-side mount before rendering animated elements.
  // This prevents server-rendered initial styles (opacity:0, translateY) from
  // causing a hydration mismatch with the client's post-animation state.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  // Skips entirely when user prefers reduced motion.
  // setState inside setTimeout callbacks is inherent to the typewriter pattern.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (prefersReducedMotion || !mounted) return;

    const currentTagline = TAGLINES[taglineIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayedText === currentTagline) {
      // Pause at full text, then start deleting
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedText === "") {
      // Move to next tagline
      setIsDeleting(false);
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    } else {
      // Type or delete one character
      timeout = setTimeout(
        () => {
          setDisplayedText(
            isDeleting
              ? currentTagline.slice(0, displayedText.length - 1)
              : currentTagline.slice(0, displayedText.length + 1),
          );
        },
        isDeleting ? 40 : 80,
      );
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, taglineIndex, prefersReducedMotion, mounted]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <section
      aria-label="Introduction"
      className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-6 sm:pb-24 sm:pt-32"
    >
      {/* Animated background gradient — purely decorative */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Name with entrance animation — non-animated div during SSR to avoid hydration mismatch */}
      {mounted && !prefersReducedMotion ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <GradientText as="h1" className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            James
          </GradientText>
        </motion.div>
      ) : (
        <div>
          <GradientText as="h1" className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            James
          </GradientText>
        </div>
      )}

      {/* Title */}
      <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
        DevOps Engineer &amp; Homelab Enthusiast
      </p>

      {/* Animated tagline — screen readers announce changes via aria-live */}
      <div
        className="mt-6 flex h-8 items-center justify-center"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="font-mono text-lg text-primary sm:text-xl">
          {!mounted || prefersReducedMotion ? TAGLINES[0] : displayedText}
        </span>
        {!prefersReducedMotion && mounted && (
          <span
            className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-primary"
            aria-hidden="true"
          />
        )}
      </div>

      {/* CTA buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" nativeButton={false} render={<Link href="/projects" />}>
          View Projects
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={
            <a
              href="https://github.com/jtmb"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <GitHubIcon className="mr-2 h-4 w-4" />
          GitHub Profile
        </Button>
      </div>

      {/* Stats bar */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border bg-card px-8 py-4 shadow-sm sm:gap-10">
        <StatItem value={repos} label="Repositories" />
        <StatItem value={stars} label="Stars" />
        <StatItem value={topLanguages.join(" · ")} label="Top Languages" />
      </div>
    </section>
  );
}

/** A single stat in the hero stats bar. */
function StatItem({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
      <p className="text-xs font-medium text-muted-foreground sm:text-sm">
        {label}
      </p>
    </div>
  );
}
