# Conventions

## Naming

| Category | Convention | Example |
|----------|-----------|---------|
| Files | kebab-case | `hero-section.tsx`, `repo-filter.tsx` |
| Components | PascalCase, file matches name | `HeroSection` in `hero-section.tsx` |
| Functions | camelCase | `getAllPosts()`, `parseFrontmatter()` |
| Interfaces/Types | PascalCase | `GitHubRepo`, `BlogPostMeta` |
| Constants | UPPER_CASE or SCREAMING_SNAKE_CASE | `TAGLINES`, `LANGUAGE_COLORS` |
| Hooks | camelCase, `use` prefix | `useReducedMotion()`, `useInView()` |
| Directories | kebab-case | `shared/`, `featured-projects/` |

## File Organization

- **One component per file** — no exceptions unless tightly coupled (e.g., `Card` + `CardHeader` + `CardContent`)
- **Co-located types** — types used by one module live in that module; shared types in `src/lib/types.ts`
- **Barrel exports** — `index.ts` re-exports only, no business logic
- **Feature grouping** — components grouped by feature (hero/, nav/, repos/, projects/, about/, blog/)
- **Shared components** — reusable primitives in `src/components/shared/`
- **Static data** — configuration/sample data in `src/data/`, one file per domain

## Client vs Server Components

- **Server by default** — pages start as server components, fetch data at build/request time
- **Client only when needed** — interactivity (state, effects, event handlers, browser APIs)
- **Pattern**: Server component fetches data → passes as props to client component
- **"use client"** directive at file top, always line 1

## Styling

- **Tailwind utility classes** — no CSS modules, no styled-components
- **shadcn/ui** for interactive primitives (Button, Card, Badge, Sheet, Tooltip, Separator)
- **cn()** utility for conditional class merging (from `@/lib/utils`)
- **Dark mode** via `next-themes` with `class` strategy — Tailwind `dark:` variants
- **Typography** via `@tailwindcss/typography` `prose` classes for MDX content
- **No inline styles** — use Tailwind classes or `style={{}}` only for dynamic values (e.g., willChange)

## shadcn/ui v2 Specifics

- Uses `@base-ui/react` primitives (NOT Radix)
- **`render` prop** for rendering as child element — NOT `asChild`
  ```tsx
  <Button render={<Link href="/" />}>Label</Button>
  ```
- Style: `base-nova`, base color: `neutral`

## GitHub API

- **Central module**: `src/lib/github.ts` — all API calls through `githubFetch()`
- **No API keys**: Uses unauthenticated endpoint (60 req/hr limit)
- **ISR everywhere**: `next: { revalidate: 3600 }` on all fetches
- **Graceful nulls**: All functions return `T | null`, callers handle null
- **Timeout**: 10s AbortController on every request

## Animation

- **Framer Motion** for scroll reveals and entrance animations
- **`useReducedMotion()`** must be checked in every animated component
- **`willChange`** hint on animated elements for GPU layer promotion
- **CSS `prefers-reduced-motion`** media query in globals.css as safety net
- **`aria-hidden`** on decorative animated elements

## Accessibility

- **Skip-to-content link** in root layout (sr-only, visible on focus)
- **`:focus-visible`** for keyboard-only focus rings (not mouse clicks)
- **`prefers-reduced-motion`** respected in CSS and JS
- **`aria-live="polite"`** on dynamic text (typewriter tagline)
- **`aria-hidden="true"`** on decorative elements (background blobs, cursor)
- **Semantic HTML**: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- **`aria-label`** on icon-only buttons and landmark regions

## Git Practices

- **Branch**: `type/description` (e.g., `feat/mdx-blog`, `fix/nav-a11y`)
- **Commit**: Conventional Commits — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- **Atomic commits**: One logical change per commit
- **No generated files**: `.next/`, `node_modules/` in `.gitignore`

## Error Handling

- **Never swallow errors silently** — log or propagate
- **API functions return `null`** on failure (no throwing across component boundaries)
- **`Promise.allSettled`** for parallel independent fetches (one failure doesn't block others)
- **Graceful degradation**: Empty states for missing data ("No posts yet", "No repos found")
- **`notFound()`** for missing blog posts (renders 404)

## TypeScript

- **Strict mode** enabled in `tsconfig.json`
- **No `any`** — use `unknown` when type is genuinely unknown
- **Explicit return types** on exported functions
- **Interface over type** for object shapes (extensibility)
- **`Promise<>`** for async return types when not inferred
