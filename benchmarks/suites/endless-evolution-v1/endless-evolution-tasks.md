# Endless Evolution — Self-Directed Feature Expansion

> **Suite**: `endless-evolution-v1`
> **Duration**: Indefinite (runs until externally stopped)
> **Languages**: TypeScript, TSX, CSS/Tailwind
> **Stack**: Next.js 16 (App Router), Framer Motion, Tailwind CSS, shadcn/ui, lucide-react
> **Theme**: Minimalist · Dark-first · Animated · Developer Portfolio

---

## ⚠️ THIS SUITE HAS NO FIXED TASK LIST

Unlike traditional benchmark suites, **there are no predefined tasks here**. The LLM must:

1. Analyze the current state of the project
2. Decide for itself what features to build next
3. Validate that everything still works after each addition
4. Never break backward compatibility

The suite runs **indefinitely**. It stops only when externally interrupted or when the LLM determines it cannot meaningfully extend the project further.

---

## How It Works — The Self-Directed Loop

Each "cycle" consists of 4 phases. The LLM repeats this loop until stopped.

```
┌─────────────────────────────────────────────────┐
│                  CYCLE N                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────────┐ │
│  │ ANALYZE  │→  │ PROPOSE  │→  │ IMPLEMENT    │ │
│  │ current  │   │ features │   │ + test each  │ │
│  │ state    │   │ (self)   │   │ feature      │ │
│  └──────────┘   └──────────┘   └──────┬───────┘ │
│                                       │         │
│  ┌──────────┐   ┌──────────┐          │         │
│  │ REPORT   │←  │ VALIDATE │← ─ ─ ─ ─┘         │
│  │ cycle N  │   │ full     │   retry if         │
│  └──────────┘   │ suite    │   failed           │
│                 └──────────┘                    │
└─────────────────────────────────────────────────┘
```

---

## Phase 1: ANALYZE (≤5 min) — HARD REQUIREMENT

**Goal**: Understand what already exists before deciding what to add. You MUST produce the output block below before moving to Phase 2.

### Actions — do ALL of these:
1. Read `.suite-features.json` — list EVERY feature name and category. Memorize them.
2. Read `components/`, `app/`, `lib/` — understand what exists.
3. Identify **3 gaps** — features NOT in `.suite-features.json`.

### Required Output — Phase 2 is BLOCKED until you write this:

```markdown
## Cycle {N} — Analysis

**Existing features**: [numbered list of ALL features from .suite-features.json]
**Components found**: [list]
**Routes found**: [list]
**Test coverage**: [component tests, e2e, etc.]
**Current deps**: [key packages]
**Gaps identified (3)**: [three new feature ideas, none overlapping with existing]
**Selected feature**: [which ONE you'll build and its category]
**Why this does not exist yet**: [confirm you checked .suite-features.json, name any similar features and explain why this is different]
```

### 🔒 GATE CHECK
If you skip Phase 1 and propose something that already exists, the cycle is an automatic FAILURE. You lose 15 diversity + 20 backward compat points.

---

## Phase 2: PROPOSE (≤3 min)

**Goal**: Select exactly ONE feature to implement this cycle.

### Constraints
- **One feature per cycle** — you must implement, test, and validate ONE feature before moving to the next.
- **Feature must be non-trivial** — no "change button color" or "add one CSS rule". Each feature should typically require **50–200+ lines of new code** (or equivalent architectural change). NO CSS MODIFICATIONS OF THE BACKGROUND AND THEME. MAKE SIGNIFICANT, COMPLETE FEATURES, ALWAYS.
- **Diversity rule** — alternate between feature categories. Don't build 3 UI animations in a row. Mix across:
  - UI / Design (new components, layouts, visual effects)
  - Data / State (data fetching, state management, APIs)
  - Infrastructure (routing, auth, database, Docker, CI)
  - Testing / Quality (new test suites, a11y, performance)
  - Content / Pages (new page types, dynamic content)
  - DX / Tooling (automation, scripts, dev tools)
- **No duplicates** — if a feature already exists (check `.suite-features.json`), pick something else.
- **Progressive complexity** — each feature should ideally be more sophisticated than the last, building on the accumulated architecture.

### Feature Proposal Format

```
FEATURE-{N}: [Feature Name]

Category: [UI|Data|Infra|Testing|Content|DX]
Depends on: [existing features this builds on, or "none"]
Complexity: [Low|Medium|High]
Estimated effort: [X] minutes

Description:
[2–3 sentences describing what this feature does]

Why this feature:
[Why it's the right next step given the current state]

Implementation plan:
- [Bullet list of files to create/modify]
- [Key implementation details]

Success criteria:
- [Concrete, testable pass/fail conditions]
```

### Validation before proceeding
- Check `SUITE-README.md` if it exists — are there specific areas the project needs?
- Check if this feature would overlap with anything already built
- If this cycle's proposal is too similar to a previous cycle's, choose something different

---

## Phase 3: IMPLEMENT + VERIFY (≤15 min)

**Goal**: Build the feature and immediately verify it works.

### Per-feature workflow
1. **Read existing code** — fully understand any files you need to modify before changing them.
2. **Implement** following the project's existing patterns (component style, file structure, naming conventions).
3. **Add tests** — at minimum one test file for the core functionality:
   - Components: render test, interaction test
   - APIs: request/response test
   - Utilities: unit test
4. **Build** — run `npm run build` (or `npm run type-check && npm run lint`):
   - If build fails → diagnose, fix, retry. Max **2 fix attempts**.
   - If build still fails → mark feature as FAILED, log the failure, skip to Phase 4.
5. **Run existing tests** — `npm run test`:
   - ALL existing tests must still pass. If any break, the feature is REJECTED.
   - If tests break → diagnose if your change caused it. If so, fix or undo. Max 2 attempts.
   - If tests still break → mark feature as FAILED, restore broken files.
6. **Update `.suite-features.json`** — add the new feature to the list.
7. **Commit to the feature ledger**.

### Build failure codes
| Code | Type | Description |
|------|------|-------------|
| B1 | Syntax/Compile | Code does not compile / syntax errors |
| B2 | Type Error | Type mismatch or missing type definitions |
| B3 | Runtime | Code runs but crashes or throws |
| B4 | Test Failure | Tests exist but do not pass |
| B5 | Lint/Format | Code style or formatting violations |
| B6 | Missing Dep | Required dependency not installed |
| B7 | Timeout | Task exceeded time limit |
| B8 | Regression | Existing feature broke after change |
| B9 | Duplicate | Feature already exists (caught in Phase 2) |

---

## Phase 4: VALIDATE + REPORT (≤5 min)

**Goal**: Full-project validation and cycle report.

### Full validation suite
1. `npm run build` — zero errors, zero warnings
2. `npm run lint` — zero warnings (unless pre-existing)
3. `npm run test` — all tests pass (old + new)
4. Check the app looks correct:
   - `npm run dev` starts without errors
   - Home page renders at localhost:3000 without crash
   - New feature is visible/functional
5. **Accessibility check** — any new interactive elements must have `aria-label` attributes and logical tab order.

### If validation fails
- One retry allowed: diagnose, fix, re-run full validation
- If validation fails after retry: mark cycle as FAILED, update `.suite-features.json` to EXCLUDE this feature (revert changes)

### Write the cycle report
Append to `ENDLESS-REPORT.md`:

```markdown
## Cycle {N}

**Feature**: FEATURE-{N}: Feature Name
**Category**: [UI|Data|Infra|Testing|Content|DX]
**Status**: [SUCCESS|FAILED]
**Duration**: Xm

### Analysis
[Brief summary of what was analyzed and why this feature was chosen]

### Implementation
- Files created: [list]
- Files modified: [list]
- Lines of code added: ~XX
- Build attempts: X
- Test results: [passed/failed]

### Validation
- Build: [PASS/FAIL]
- Lint: [PASS/FAIL]
- Tests: [PASS/FAIL]
- Smoke test: [PASS/FAIL]
- Backward compat: [PASS/FAIL]

### State
- Total features: X
- Feature list: [feature-1, feature-2, ...]
- Cumulative cycles: N
- Total tokens used: X,XXX

### Token Usage
Record per-cycle tokens:
- Input tokens consumed (analysis, proposal, implementation prompts)
- Output tokens generated (code, reports, documentation)
- Running cumulative total across all cycles
```

### Update state file
Update `.suite-features.json`:

```json
{
  "suite": "endless-evolution-v1",
  "totalCycles": 3,
  "features": [
    {
      "id": "FEATURE-1",
      "name": "Dark Mode Theme Toggle",
      "category": "UI",
      "status": "SUCCESS",
      "cycle": 1,
      "files": ["components/theme-toggle.tsx", "components/theme-provider.tsx"]
    }
  ],
  "failedCycles": [],
  "lastCycleDate": "2026-06-22"
}
```

### ➡️ SPAWN NEXT CYCLE via new_task — Phase 4 step 5 (MANDATORY)

Completing the report and state update does **NOT** mean Phase 4 is done.

Use the `new_task` MCP tool to spawn a new autonomous task for the next cycle.
Pass this exact prompt:

```
Cycle N+1: Read .suite-features.json. Analyze existing features,
propose ONE new feature not in the list, implement it, add tests,
validate (build + test), update .suite-features.json, and append
report to ENDLESS-REPORT.md. Then spawn Cycle N+2 via new_task.
```

Do NOT implement the next cycle yourself.

If validation failed this cycle, still spawn the next cycle. Stopping after a
successful cycle is NOT a valid stopping condition — that's the expected flow.

---

## Starting Fresh — Foundation Build

If this is the very first run (no project exists at `/`), the LLM must build a **foundation** first. This counts as Cycle 0 or Cycles 1–3.

### Minimum viable foundation
- Next.js 16 project scaffold with TypeScript + App Router
- Tailwind CSS with dark-first theme (`globals.css`)
- Root layout with Geist/Inter font
- A hero section with name + tagline
- A simple nav with smooth scroll
- A skills section with 4+ items
- A projects section with 3+ items
- A contact form
- A footer
- Theme toggle (dark/light)
- ThemeProvider with localStorage persistence
- Basic entrance animations on scroll (framer-motion)
- `vitest.config.ts` + at least one component test
- `.suite-features.json` with these foundation features registered

### Why no detailed foundation tasks?
The LLM is expected to **figure out what a basic portfolio needs** and build it. This tests autonomous capability estimation — can you scope a realistic MVP without hand-holding?

---

## Self-Directed Feature Ideas

The following are **examples** of the kind of features the LLM might propose. **Do not blindly implement these** — they're here to illustrate the range:

### UI / Design
- Animated gradient background with floating orbs
- Typing animation on hero subtitle
- Scroll progress bar
- Back-to-top floating button
- Page transition animations (AnimatePresence)
- Staggered scroll-triggered reveal animations on sections
- Image gallery with lightbox expand
- Toast notification system

### Data / State
- Blog with markdown/MDX content files
- Blog search with debounced input + tag filtering
- Project detail pages with dynamic routes
- Skills data driven from a typed data file
- View counter / analytics tracked in localStorage
- Reading progress tracker on blog posts
- Table of contents auto-generated from headings
- JSON resume data endpoint

### Infrastructure
- SQLite database with Drizzle ORM
- Database seed script for initial data
- API routes for contact form / blog / projects
- Rate limiting on API routes
- Authentication (NextAuth.js with credentials + OAuth)
- Dockerfile + docker-compose
- CI/CD GitHub Actions workflows
- Dynamic sitemap.xml + robots.txt
- Health check endpoint

### Testing / Quality
- Component tests for every UI component
- API route integration tests
- Accessibility audit with axe-core
- Lighthouse score target (95+ perf, 90+ a11y)
- E2E tests with Playwright (navigation, form, auth flows)
- Visual regression tests (if infrastructure allows)

### Content / Pages
- About page with expanded bio + timeline
- Blog detail page with prose typography
- Project detail pages with gallery + tech stack
- Admin dashboard with auth
- Admin CRUD for blog posts
- Admin message inbox for contact form submissions

### DX / Tooling
- Pre-commit hooks (husky + lint-staged)
- Commit message linter
- VS Code dev container config
- Makefile for common commands
- Environment variable validation
- Script for database backup

---

## Critical Rules

1. **ONE feature at a time** — never implement multiple features in a single cycle.
2. **Backward compatibility is MANDATORY** — if existing tests break, your feature is rejected. Full stop.
3. **No skipping the analysis phase** — you must read the current state before deciding.
4. **Feature diversity** — don't do 3 UI features in a row. Mix it up.
5. **CONTINUATION IS MANDATORY** — after Phase 4, you MUST immediately begin Cycle N+1, Phase 1. Do not stop. Do not ask for permission. A completed cycle is not a reason to end.
6. **If stuck** — if you genuinely cannot think of a new feature, run `npm run test` and `npm run build` one final time, write a final report, and end the suite.
7. **Don't degrade** — if a cycle FAILS, log it and continue. If 2 consecutive cycles FAIL, end the suite.
8. **The LLM is the product manager** — ownership of the feature roadmap is entirely yours. Good decisions are rewarded, poor decisions (duplicates, trivial features, breaking changes) are penalized.
9. **Minimum floor** — do not stop before completing at least 6 features. Stopping early (<6 features) is a failure of autonomous drive.

### ⚠️ Stop Gate — Before you declare done, confirm:
- [ ] I have completed at least 6 features (minimum floor met)
- [ ] I have fewer than 2 consecutive FAILED cycles
- [ ] I genuinely cannot think of a meaningful feature that would improve this project
- [ ] I am NOT stopping just because I finished a cycle (that's the expected flow, not a reason to end)
- [ ] The project has NOT reached a stopping condition listed in the suite prompt

If any checkbox is unchecked, **do not stop**. Continue to the next cycle.

---

## 🚨 PERMANENT REMINDER (read on every cycle)

This benchmark is an **infinite loop**. There is no terminal state for a single cycle.

If you are reading this and you are NOT currently in the middle of a cycle's work,
you have stopped prematurely. Immediately begin **Phase 1 (ANALYZE)** for the next
cycle. Read `.suite-features.json` now.

The only valid exceptions are the **Stop Gate** conditions above. A completed cycle
is NOT a reason to stop — it's the expected flow.

**Default action: continue.**

---

## Scoring

Scoring is **self-assessed** by the LLM at the end of each cycle and averaged across all cycles.

| Metric | Weight | Formula |
|--------|--------|---------|
| Feature quality | 30% | LLM self-rating 1–10 × 3 (trivial=1, novel=10) |
| Build stability | 20% | 20 − (failed_builds × 5) |
| Backward compat | 20% | 20 − (regressions × 10) |
| Test coverage | 15% | 15 if new tests added, 0 if not |
| Feature diversity | 15% | 15 if category differs from last 2, 0 if not |

**Cycle Score** = sum of all weighted metrics (out of 100).
**Cumulative Average** = running average across all cycles.
