# Codebase Structure

**Analysis Date:** 2026-03-31

## Directory Layout
```
ohunjal-ai/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── app/page.tsx      # Main SPA orchestrator (all state)
│   │   ├── page.tsx          # Landing page (static)
│   │   ├── LandingContent.tsx # Landing page components
│   │   ├── layout.tsx        # Root layout + metadata
│   │   ├── landing/          # Marketing page
│   │   ├── terms/            # Terms of service
│   │   ├── privacy/          # Privacy policy
│   │   ├── globals.css       # Tailwind + CSS variables
│   │   └── sitemap.ts        # SEO sitemap
│   ├── components/           # UI components (21 files)
│   ├── constants/            # Types, exercise pools, theme
│   │   ├── workout.ts        # Core types + generateAdaptiveWorkout (2000+ lines)
│   │   ├── theme.ts          # Design tokens (THEME, LAYOUT)
│   │   └── exerciseVideos.ts # YouTube video mappings
│   ├── utils/                # Business logic
│   │   ├── workoutMetrics.ts # 1RM, intensity, training level
│   │   ├── workoutHistory.ts # Firestore CRUD + localStorage
│   │   ├── userProfile.ts    # Profile loading
│   │   ├── questSystem.ts    # EXP/tier/quest
│   │   ├── predictionUtils.ts # Growth prediction
│   │   └── gemini.ts         # Cloud Function API wrappers
│   ├── hooks/
│   │   └── useSafeArea.ts    # PWA safe area insets
│   ├── lib/
│   │   └── firebase.ts       # Firebase SDK init
│   └── types/
│       └── portone.d.ts      # PortOne type defs
├── functions/                # Cloud Functions (active, Node 22)
│   ├── src/index.ts          # All endpoints
│   ├── package.json
│   └── tsconfig.json
├── ohunjal/                  # Separate Cloud Functions (NOT deployed)
├── public/                   # Static assets
├── firebase.json             # Hosting + function rewrites
├── next.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md                 # Project documentation
```

## Key Components (by size)
| File | Lines | Role |
|------|-------|------|
| `FitnessReading.tsx` | ~1874 | Growth prediction page |
| `FitScreen.tsx` | ~1680 | Exercise execution |
| `ProofTab.tsx` | ~1444 | History + stats |
| `WorkoutReport.tsx` | ~1200 | Post-workout report |
| `MasterPlanPreview.tsx` | ~920 | Workout plan preview |
| `HomeScreen.tsx` | ~570 | Home screen |
| `MyProfileTab.tsx` | ~564 | Profile settings |
| `ConditionCheck.tsx` | ~500 | Condition input |
| `WorkoutSession.tsx` | ~430 | Session orchestration |
| `AiCoachChat.tsx` | ~170 | AI coaching chat popup |

## Naming Conventions
- **Components:** PascalCase `.tsx` (`LoginScreen.tsx`)
- **Utils:** camelCase `.ts` (`workoutMetrics.ts`)
- **Hooks:** `use` prefix camelCase (`useSafeArea.ts`)
- **Constants:** UPPER_CASE (`THEME`, `LAYOUT`, `WARMUP_POOLS`)
- **Types:** PascalCase (`UserCondition`, `WorkoutSessionData`)

## Path Alias
- `@/*` → `src/*` (configured in `tsconfig.json`)

---
*Structure analysis: 2026-03-31*
