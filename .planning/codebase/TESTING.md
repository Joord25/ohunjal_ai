# Testing

**Analysis Date:** 2026-03-31

## Current State
**No test suite configured.** (documented in CLAUDE.md)

## Available Checks
| Tool | Command | Scope |
|------|---------|-------|
| ESLint | `npm run lint` | Code style, unused vars |
| TypeScript | `npx tsc --noEmit` | Type checking |
| Build | `npm run build` | Full compilation |

## Test Files
- **None found** — no `.test.ts`, `.spec.ts`, `__tests__/` directories

## Test Framework
- **Not installed** — no Jest, Vitest, Playwright, Cypress in dependencies

## Manual Testing
- **Dev server:** `npm run dev` (Turbopack)
- **Cloud Functions:** `cd functions && npm run serve` (emulators)
- **Deployed preview:** GitHub Actions creates preview on PRs

## Coverage
- **0%** — no automated tests

## Recommendations for Future
1. **Vitest** — fast, TS-native, works well with Next.js
2. **Priority targets:**
   - `src/constants/workout.ts` — `generateAdaptiveWorkout()` (pure function, easy to test)
   - `src/utils/workoutMetrics.ts` — 1RM calculations (pure functions)
   - `src/utils/questSystem.ts` — EXP/tier calculations (pure functions)
   - `src/utils/predictionUtils.ts` — regression analysis (pure functions)
3. **E2E:** Playwright for critical user flows (login → workout → report)

---
*Testing analysis: 2026-03-31*
