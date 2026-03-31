# Concerns & Technical Debt

**Analysis Date:** 2026-03-31

## Tech Debt

### 1. Monolithic State (Critical)
- **File:** `src/app/app/page.tsx`
- **Issue:** ALL app state lives in one component — view, auth, workout, subscription, tabs
- **Impact:** Any state change re-renders entire app tree
- **Risk:** Adding features increases complexity exponentially

### 2. Giant Components
- **Files over 1000 lines:**
  - `FitnessReading.tsx` (~1874 lines)
  - `FitScreen.tsx` (~1680 lines)
  - `ProofTab.tsx` (~1444 lines)
  - `WorkoutReport.tsx` (~1200 lines)
  - `constants/workout.ts` (~2000+ lines)
- **Impact:** Hard to maintain, slow to understand, merge conflicts

### 3. Hardcoded Korean Strings
- **Scope:** All components
- **Issue:** User-facing text directly in JSX, no i18n system
- **Impact:** Multi-language support requires touching every component
- **Plan:** i18n migration planned (영문/일어)

### 4. No Test Coverage
- **Scope:** Entire codebase
- **Issue:** Zero automated tests
- **Impact:** Refactoring is risky, regressions undetected
- **Priority targets:** Pure functions in utils/ and constants/

### 5. localStorage as Database
- **Scope:** `src/utils/workoutHistory.ts`, multiple components
- **Issue:** Heavy reliance on localStorage for state persistence
- **Impact:** Data loss on cache clear, no cross-device sync guarantee

### 6. Unused Codebase (`ohunjal/`)
- **Location:** `ohunjal/` directory
- **Issue:** Separate Cloud Functions codebase (Node 24, v7) not deployed
- **Impact:** Confusion, dead code in repo

## Security Concerns

### 1. Client-Side API Keys
- **Issue:** `NEXT_PUBLIC_GEMINI_API_KEY` exposed in client bundle
- **Mitigation:** Gemini calls go through Cloud Functions (server-side key), but client key still visible
- **Risk:** Low (Cloud Functions are the actual API consumer)

### 2. PortOne Keys in Client
- **Issue:** `NEXT_PUBLIC_PORTONE_STORE_ID`, `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` in client
- **Risk:** Medium — payment integration keys visible in source

### 3. No Input Sanitization
- **Issue:** User inputs (weight, birthYear, name) stored without sanitization
- **Mitigation:** TypeScript types provide some safety, Firestore rules needed

### 4. Health Data Unencrypted
- **Issue:** Workout history, body weight, health metrics in Firestore without encryption
- **Risk:** Sensitive health data compliance (depending on jurisdiction)

## Performance Bottlenecks

### 1. Unmemoized Calculations
- **Scope:** ProofTab, FitnessReading, WorkoutReport
- **Issue:** Heavy computations (regression analysis, tier calculation) re-run on every render
- **Fix:** useMemo for expensive calculations

### 2. YouTube Iframe Embeds
- **Scope:** FitScreen, MasterPlanPreview
- **Issue:** Multiple iframes loading YouTube videos
- **Impact:** Slow initial load, bandwidth consumption

### 3. Full History Loading
- **Scope:** `loadWorkoutHistory()` loads ALL records
- **Issue:** No pagination or date-range filtering
- **Impact:** Slow as history grows (100+ sessions)

### 4. No Image Optimization
- **Scope:** Landing page partner logos, profile photos
- **Issue:** Some images served without Next.js Image optimization

## Fragile Areas

### 1. JSON Parse Without Validation
- **Scope:** localStorage reads throughout codebase
- **Pattern:** `JSON.parse(localStorage.getItem(...) || "[]")`
- **Risk:** Corrupted data crashes the app (try-catch mitigates but loses data)

### 2. Adaptive Rep Logic
- **File:** `WorkoutSession.tsx` lines 116-134
- **Issue:** Feedback-based rep adjustment has complex branching
- **Risk:** Edge cases (0 reps, NaN weight) could propagate

### 3. Subscription State
- **Issue:** Subscription checked on login, cached in state
- **Risk:** State can become stale if subscription expires mid-session

## Missing Critical Features
1. **Error boundary** — no React error boundary for graceful failures
2. **Offline mode** — localStorage fallback exists but no service worker sync
3. **Data export** — users can't export their workout history
4. **Account deletion** — no self-service account/data deletion (GDPR/개인정보보호법)

---
*Concerns analysis: 2026-03-31*
