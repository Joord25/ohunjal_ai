# Architecture

**Analysis Date:** 2026-03-31

## Pattern Overview
Monolithic React SPA with centralized state in `src/app/app/page.tsx`. No router library — view transitions managed via `ViewState` type union. Cloud Functions handle server-side AI calls and payment processing.

## Layers

### Presentation (UI)
- **Location:** `src/components/` (21 files)
- **Pattern:** Functional components with props drilling from `page.tsx`
- **Key components:** HomeScreen, ConditionCheck, MasterPlanPreview, FitScreen, WorkoutSession, WorkoutReport, ProofTab, MyProfileTab, FitnessReading

### State Orchestration
- **Location:** `src/app/app/page.tsx`
- **Pattern:** Single `"use client"` component holds ALL app state
- **States:** `view` (ViewState), `activeTab` (TabId), `currentWorkoutSession`, `workoutLogs`, `user`, `subStatus`
- **No external state library** — pure React useState/useEffect

### Business Logic
- **Location:** `src/utils/`, `src/constants/workout.ts`
- **Key files:**
  - `workoutMetrics.ts` — 1RM estimation, intensity classification, training level
  - `questSystem.ts` — EXP/tier/quest system
  - `predictionUtils.ts` — growth prediction (regression analysis)
  - `workout.ts` — `generateAdaptiveWorkout()` algorithm, exercise pools

### Data Layer
- **Firestore** — primary persistence (workout history, user profile)
- **localStorage** — cache/fallback with `alpha_*` key prefix
- **Pattern:** Try Firestore first, fallback to localStorage silently

### Server (Cloud Functions)
- **Location:** `functions/src/index.ts`
- **Endpoints:** generateWorkout, analyzeWorkout, getSubscription, subscribe, cancelSubscription
- **Auth:** Firebase ID token verification

## Data Flow — Workout Session
```
HomeScreen → ConditionCheck → generatePlan()
  ├─ AI path: Cloud Function → Gemini API → WorkoutSessionData
  └─ Rule path: generateAdaptiveWorkout() → WorkoutSessionData (instant, free)
→ MasterPlanPreview (user adjusts) → WorkoutSession
→ FitScreen (per exercise, per set) → feedback → adaptive reps
→ WorkoutReport → saveWorkoutHistory() → Firestore + localStorage
```

## View Routing
```typescript
type ViewState = "login" | "condition_check" | "master_plan_preview"
  | "workout_session" | "workout_report" | "home" | "prediction_report";
type TabId = "home" | "proof" | "my";
```
- `renderContent()` switch statement in `page.tsx`
- Tab navigation via `BottomTabs` component
- `activeTab` + `view` together determine what renders

## Error Handling
- **AI fallback:** Gemini fails → rule-based generator
- **Firestore fallback:** Network error → localStorage cache
- **Silent failures:** try-catch with console.error, return null/default
- **No global error boundary**

---
*Architecture analysis: 2026-03-31*
