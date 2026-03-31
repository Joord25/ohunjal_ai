# Tech Stack

**Analysis Date:** 2026-03-31

## Languages
- **TypeScript** (strict mode) — primary language for frontend and Cloud Functions
- **JavaScript** — config files only (next.config.ts, eslint.config.mjs)

## Runtime
- **Node.js 22** — Cloud Functions (`functions/`)
- **Browser** — Next.js client-side rendering

## Frameworks
| Framework | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.4 | App Router, SSR/SSG, API routes |
| React | 19.2.3 | UI rendering |
| TailwindCSS | 4.x | Utility-first styling |
| Firebase SDK | 12.10.0 | Auth, Firestore, Storage, Hosting |
| firebase-functions | 6.x | Cloud Functions (Node 22) |

## Key Dependencies (Frontend)
| Package | Purpose |
|---------|---------|
| `@google/genai` | Gemini AI client (not directly used in frontend — calls via Cloud Functions) |
| `firebase` | Firebase client SDK (Auth, Firestore, Storage) |
| `html2canvas-pro` | Workout share card screenshot generation |
| `next` | Framework |
| `react` / `react-dom` | UI |
| `tailwindcss` | Styling |

## Key Dependencies (Cloud Functions)
| Package | Purpose |
|---------|---------|
| `firebase-functions` v6 | HTTP function handlers |
| `firebase-admin` | Server-side Firebase SDK |
| `@google/genai` | Gemini 2.5 Flash API calls |

## Configuration Files
- `tsconfig.json` — Root TS config, path alias `@/*` → `src/*`, excludes `functions/` and `ohunjal/`
- `next.config.ts` — Next.js config, COOP header for Google sign-in popup
- `firebase.json` — Hosting config, function rewrites (`/api/*`), CORS headers
- `.eslintrc.json` / `eslint.config.mjs` — ESLint v9 flat config
- `.prettierrc.json` — Code formatting

## Environment Variables
### Frontend (`.env.local`, `NEXT_PUBLIC_*`)
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID`
- `NEXT_PUBLIC_GEMINI_API_KEY`
- `NEXT_PUBLIC_PORTONE_STORE_ID`, `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`

### Cloud Functions
- `GEMINI_API_KEY` — server-side, set via Firebase config

## Build & Deploy
- `npm run dev` — Next.js dev server with Turbopack
- `npm run build` — Production build
- `npm run lint` — ESLint check
- Firebase Hosting + GitHub Actions CI/CD (auto-deploy on push to main)
- Cloud Functions: `cd functions && npm run build` → `firebase deploy --only functions`

---
*Stack analysis: 2026-03-31*
