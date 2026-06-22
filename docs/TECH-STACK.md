# Tech Stack

## Languages

| Language | Usage | Why |
|----------|-------|-----|
| TypeScript 5 | All source code | Type safety, excellent IDE support, Next.js native |
| MDX | Blog posts | Markdown + JSX components, file-based, no CMS needed |

## Frameworks

| Framework | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.9 | App Router, SSR, ISR, file-based routing, React Server Components |
| React | 19.2.4 | UI component library |
| Tailwind CSS | v4 | Utility-first CSS, JIT compilation, dark mode |
| shadcn/ui | v2 | Headless UI primitives (base-nova style, @base-ui/react) |

## Key Dependencies

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| framer-motion | ^12 | Animations, scroll reveals | Declarative, `useReducedMotion`, small bundle |
| next-themes | ^0.4 | Dark/light theme toggle | SSR-safe, `attribute="class"`, system default |
| @next/mdx | ^16 | MDX processing in Next.js | Official, handles serialization |
| @mdx-js/mdx | ^3 | MDX compiler | Required by @next/mdx |
| lucide-react | ^0.510 | Icon library | Tree-shakeable, consistent style |
| @tailwindcss/typography | ^0.5 | Blog post prose styling | Tailwind-first, handles MDX output |
| tw-animate-css | ^1 | CSS animation utilities | Tailwind v4 compatible animation classes |
| @base-ui/react | * | shadcn/ui v2 primitives | Headless, accessible, WAI-ARIA compliant |
| @types/node | ^22 | Node.js type definitions | devDependency |
| @types/react | ^19 | React type definitions | devDependency |

## Development Tools

| Tool | Purpose |
|------|---------|
| TypeScript (`tsc --noEmit`) | Type checking (strict mode) |
| ESLint (`next lint`) | Linting (Next.js core-web-vitals) |
| PostCSS | Tailwind v4 CSS processing |

## Fonts

| Font | Source | Usage |
|------|--------|-------|
| Geist Sans | next/font/google | Body, headings (--font-geist-sans) |
| Geist Mono | next/font/google | Code blocks, typewriter (--font-geist-mono) |

## Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Hosting, ISR cache, edge network |
| GitHub REST API | Data source for repos, stars, languages |
| GitHub Actions | Profile README automation (cron schedule) |
| github-readme-stats | Dynamic stats badges in profile README |

## Version Policy

- All dependencies pinned to exact versions in `package.json`
- TypeScript strict mode enabled
- No `^` or `~` ranges for runtime dependencies
- Dev dependencies use caret ranges
