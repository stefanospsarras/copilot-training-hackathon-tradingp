---
applyTo: "frontend/**"
---

# Frontend Instructions — Team Skills Matrix Platform

## Stack

- **Framework:** React 18 with TypeScript
- **Bundler / Dev server:** Vite
- **Router:** React Router v6
- **Testing:** Vitest + React Testing Library
- **Port:** 5173

## Project Layout

```
frontend/src/
├── api/          # Typed fetch wrappers — one file per backend resource
│   ├── client.ts       # Base fetch helper (handles errors, JSON)
│   ├── types.ts        # Shared TypeScript types (mirrors backend)
│   ├── skills.ts
│   ├── engineers.ts
│   ├── heatmap.ts
│   ├── gapAnalysis.ts
│   └── training.ts
├── pages/        # One component per route
│   ├── SkillsPage.tsx
│   ├── EngineersPage.tsx
│   ├── ProfilePage.tsx
│   ├── HeatmapPage.tsx
│   ├── GapAnalysisPage.tsx
│   └── TrainingPage.tsx
├── components/   # Reusable presentational components
├── test/
│   └── setup.ts  # @testing-library/jest-dom import
├── App.tsx       # Router + nav layout
└── main.tsx      # Entry point
```

## Architecture Rules

- **Components never call `fetch` directly.** All HTTP calls go through the typed wrappers in `src/api/`. This makes components testable by mocking the api module.
- **Pages own data fetching** (via `useEffect` + api calls). Pass data down to child components as props.
- **No business logic in components.** Gap calculations, sorting, and filtering belong in the backend; the frontend only renders what the API returns.
- **Vite proxy:** the dev server proxies `/api` → `http://localhost:3001`, so no CORS config is needed during development.

## Domain Types (`src/api/types.ts`)

```ts
interface Skill { id: string; name: string; category: string; targetLevel: number; }
interface Engineer { id: string; name: string; team: string; role: string; skillLevels: Record<string, number>; }
interface HeatmapData { skills: Skill[]; engineers: Engineer[]; }
interface SkillGap { skillId: string; skillName: string; category: string; targetLevel: number; teamAverage: number; gap: number; }
interface TrainingRecommendation { skillId: string; skillName: string; category: string; currentLevel: number; targetLevel: number; gap: number; }
```

Competency levels are integers **1–5** (1 = Beginner, 5 = Expert).

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | redirect | → `/engineers` |
| `/skills` | SkillsPage | Skills CRUD |
| `/engineers` | EngineersPage | Engineer list with team/role filter |
| `/engineers/:id` | ProfilePage | View & edit engineer skill levels |
| `/engineers/:id/training` | TrainingPage | Per-engineer training recommendations |
| `/heatmap` | HeatmapPage | Color-coded engineers × skills grid |
| `/gap-analysis` | GapAnalysisPage | Skills ranked by org-wide gap |

## Heatmap Color Scale

Apply as cell background color:

| Condition | Color |
|---|---|
| `gap <= 0` (at or above target) | `#4ade80` green |
| `gap === 1` | `#facc15` yellow |
| `gap === 2` | `#fb923c` orange |
| `gap >= 3` | `#f87171` red |
| No rating | `#e2e8f0` gray |

## Build, Lint & Test Commands

```bash
cd frontend
npm run build   # Vite production build
npm run lint    # ESLint
npm test        # Vitest (run once)
npm test -- <file>  # single file
```

## Testing Requirements

- Use **Vitest + React Testing Library** for all unit tests.
- **Mock `src/api/*`** modules — never make real HTTP calls in tests.
- Each page component should have a test file covering: successful render, loading/error states, and at least one user interaction (add, edit, delete, filter).
- Wrap components under test in `<BrowserRouter>` (or `<MemoryRouter>`) when they use router hooks.
