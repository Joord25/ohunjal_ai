# External Integrations

**Analysis Date:** 2026-03-31

## APIs

### Google Gemini 2.5 Flash
- **Purpose:** AI workout plan generation + post-workout analysis
- **Client:** `@google/genai` in Cloud Functions (`functions/src/index.ts`)
- **Frontend wrapper:** `src/utils/gemini.ts` calls Cloud Functions via `/api/generateWorkout`, `/api/analyzeWorkout`
- **Auth:** Firebase ID token required (Bearer header)
- **Output:** Structured JSON (workout plans), Korean-language coaching text (analysis)

### PortOne Payment Gateway
- **Purpose:** Subscription billing (월 6,900원 프리미엄)
- **Endpoints:** `/api/subscribe`, `/api/cancelSubscription`, `/api/getSubscription`
- **Client config:** `NEXT_PUBLIC_PORTONE_STORE_ID`, `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
- **Server:** Cloud Functions call PortOne billing API
- **UI:** `src/components/SubscriptionScreen.tsx`

### YouTube
- **Purpose:** Exercise form guide videos (embedded iframes)
- **Config:** `src/constants/exerciseVideos.ts` — exercise name → YouTube video ID mapping
- **Pattern:** Direct embed URLs + YouTube search fallback

## Data Storage

### Firebase Firestore (Primary)
- **Collections:**
  - `/users/{uid}/workoutHistory/` — workout sessions with logs, stats, analysis
  - `/users/{uid}/profile/` — user profile (gender, birthYear, bodyWeight, 1RM)
- **Client:** `src/utils/workoutHistory.ts`, `src/utils/userProfile.ts`
- **Fallback:** localStorage (offline-first pattern)

### localStorage (Cache)
- **Keys:** `alpha_workout_history`, `alpha_weight_log`, `alpha_body_weight`, `alpha_gender`, `alpha_birth_year`, `alpha_fitness_profile`, `alpha_plan_count`, `alpha_guest_trial_count`
- **Pattern:** Firestore → localStorage sync, read from localStorage for fast renders

### Firebase Cloud Storage
- **Purpose:** Profile photo uploads
- **Client:** `src/components/MyProfileTab.tsx` uses `ref`, `uploadBytes`, `getDownloadURL`

## Authentication
- **Provider:** Firebase Auth with Google sign-in (popup)
- **Client:** `src/lib/firebase.ts` — `auth`, `googleProvider`
- **Flow:** `onAuthStateChanged` listener in `src/app/app/page.tsx`
- **Cloud Functions:** `Authorization: Bearer <idToken>` header verification
- **Header:** `Cross-Origin-Opener-Policy: same-origin-allow-popups` (required for Google popup)

## CI/CD
- **Platform:** GitHub Actions
- **Trigger:** Auto-deploy on push to `main`, preview deployments on PRs
- **Target:** Firebase Hosting (project: `ohunjal`)
- **Config:** `FIREBASE_CLI_EXPERIMENTS: webframeworks`

## Firebase Rewrites (`firebase.json`)
| Path | Cloud Function |
|------|---------------|
| `/api/generateWorkout` | `generateWorkout` |
| `/api/analyzeWorkout` | `analyzeWorkout` |
| `/api/getSubscription` | `getSubscription` |
| `/api/subscribe` | `subscribe` |
| `/api/cancelSubscription` | `cancelSubscription` |

---
*Integrations analysis: 2026-03-31*
