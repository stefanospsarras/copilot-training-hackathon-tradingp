---
applyTo: "backend/**"
---

# Backend Instructions — Team Skills Matrix Platform

## Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express
- **Datastore:** lowdb 1.x (JSON file-based, CJS-compatible — do NOT use lowdb 3.x)
- **Port:** 3001

## Project Layout

```
backend/
├── src/
│   ├── db/             # lowdb initialisation & seed data (database.ts)
│   ├── repositories/   # ISkillRepository, SkillRepository, IEngineerRepository, EngineerRepository
│   ├── services/       # SkillService, EngineerService, GapAnalysisService, TrainingService
│   ├── routes/         # One file per resource (skills.ts, engineers.ts, heatmap.ts, …)
│   ├── types.ts        # Shared Skill / Engineer interfaces
│   ├── app.ts          # Express app wiring (routes, middleware)
│   └── index.ts        # Server entry point (listen on PORT)
├── data/
│   └── db.json         # Runtime datastore (git-ignored)
├── jest.config.js
├── tsconfig.json
└── package.json
```

## Architecture Rules

- **Repository layer is mandatory.** All lowdb reads/writes go through a repository class. Services must never import `db` directly. This keeps unit tests mockable.
- **Service layer owns all business logic.** Routes are thin: parse request → call service → send response.
- **All routes are prefixed `/api`** — mount in `app.ts`, never inside individual route files.
- **DB path is configurable** via `DB_PATH` env var (default: `backend/data/db.json`).

## Domain Model

```ts
interface Skill {
  id: string;          // uuid
  name: string;
  category: string;
  targetLevel: number; // 1–5
}

interface Engineer {
  id: string;          // uuid
  name: string;
  team: string;
  role: string;
  skillLevels: Record<string, number>; // skillId → level (1–5)
}
```

Competency levels are integers **1–5** throughout (1 = Beginner, 5 = Expert). Validate on every write.

## REST API

| Method | Path | Description |
|---|---|---|
| GET | `/api/skills` | List all skills |
| POST | `/api/skills` | Create a skill |
| GET | `/api/skills/:id` | Get skill by id |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| GET | `/api/engineers` | List all engineers |
| POST | `/api/engineers` | Create an engineer |
| GET | `/api/engineers/:id` | Get engineer by id |
| PUT | `/api/engineers/:id` | Update engineer metadata |
| DELETE | `/api/engineers/:id` | Delete engineer |
| PUT | `/api/engineers/:id/skills` | Update skill levels for an engineer |
| GET | `/api/heatmap` | `{ skills, engineers }` for the heatmap view |
| GET | `/api/gap-analysis` | Skills ranked by org-wide gap (desc) |
| GET | `/api/engineers/:id/training` | Per-engineer training recommendations |

## Business Logic

- **Gap:** `gap = skill.targetLevel - engineer.skillLevels[skillId]` (positive = below target)
- **Gap analysis:** average across all engineers who have rated the skill; exclude skills with zero ratings; sort by gap descending.
- **Training recommendations:** top 5 skills with `gap > 0` for a given engineer, sorted by gap descending.

## Build, Lint & Test Commands

```bash
cd backend
npm run build   # tsc
npm run lint    # ESLint
npm test        # Jest with coverage
npm test -- --testPathPattern=<file>  # single file
```

## Testing Requirements

- All service-layer logic must have **Jest unit tests**.
- **Mock the repository** — never let tests touch the real db.json.
- Target **≥ 80% line coverage** (enforced by `coverageThreshold` in `jest.config.js`).
- Test happy path + validation errors + not-found cases for every service method.
