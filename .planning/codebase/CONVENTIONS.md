# Code Conventions

**Analysis Date:** 2026-03-31

## Component Pattern
- **Functional components only** — no class components
- **Named exports:** `export const ComponentName: React.FC<Props> = ({...}) => {}`
- **No default exports** (except Next.js pages)
- **Props interface** defined above component or inline

## State Management
- **All state in `src/app/app/page.tsx`** — centralized orchestrator
- **Props drilling** — no Context API, no Redux, no Zustand
- **localStorage** for persistence with `alpha_<key>` prefix
- **Firestore** for cloud persistence, localStorage as fallback

## Styling
- **TailwindCSS 4** utility classes inline
- **No CSS modules or styled-components**
- **Theme tokens** in `src/constants/theme.ts` (THEME object)
- **CSS variables** in `globals.css` for safe areas, animations
- **Responsive:** `sm:` breakpoint at 640px for desktop/mobile split

## TypeScript
- **Strict mode** enabled
- **Type imports:** `import type { X } from "..."`
- **No `any`** in component code (some in utils for flexibility)
- **Interface > Type** for component props

## Error Handling
- **try-catch with silent failures** for localStorage/Firestore ops
- **console.error** for logging (no external logger)
- **Null returns** for failed API calls (caller checks for null)
- **No global error boundary**

## Import Organization
```typescript
"use client";                              // 1. Directive
import React, { useState, useEffect } from "react";  // 2. React
import { ExternalLib } from "external";    // 3. External
import { Internal } from "@/constants/..."; // 4. Internal (@/ alias)
import { Component } from "./Component";   // 5. Relative
```

## File Organization
- **One component per file** (with sub-components allowed)
- **Helper functions** above main component in same file
- **Interfaces** at top of file, below imports

## Korean Language
- **All user-facing text** in Korean (hardcoded in components)
- **Code comments** in Korean for domain logic
- **Variable/function names** in English
- **No i18n library** — future migration planned

## localStorage Keys
- Pattern: `alpha_<feature>_<detail>`
- Examples: `alpha_workout_history`, `alpha_body_weight`, `alpha_plan_count`

---
*Conventions analysis: 2026-03-31*
