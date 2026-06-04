# Copilot Instructions — Team Skills Matrix Platform

## Project Overview

A full-stack web application that tracks engineering skills across an organization. It gives engineering leaders visibility into team capabilities, highlights gaps against target competency levels, and guides individual development through training recommendations.

## Architecture

Monorepo with two top-level workspaces:

```
/
├── backend/    # REST API server
├── frontend/   # Single-page application
└── docker-compose.yml
```

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express
- **Datastore:** lowdb (JSON file-based, no external DB required)
- **Port:** 3001

### Frontend
- **Framework:** React with TypeScript
- **Bundler:** Vite
- **Port:** 5173

## Dev Environment

Start all services:
```bash
docker-compose up
```

Or run each workspace independently:
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

## Build, Test & Lint Commands

```bash
# Backend
cd backend
npm run build          # compile TypeScript
npm run lint           # ESLint
npm test               # run all unit tests (Jest)
npm test -- --testPathPattern=<file>  # run a single test file

# Frontend
cd frontend
npm run build          # production build
npm run lint           # ESLint
npm test               # run all unit tests (Vitest)
npm test -- <file>     # run a single test file

# Browser (E2E) tests
cd e2e && npm test                    # all Playwright tests
cd e2e && npx playwright test <file>  # single spec file
```

## Domain Model

| Entity | Key Fields |
|---|---|
| `Skill` | `id`, `name`, `category`, `targetLevel` (1–5) |
| `Engineer` | `id`, `name`, `team`, `role`, `skillLevels: Record<skillId, level>` |

Competency levels are integers **1–5** throughout the stack (1 = Beginner, 5 = Expert).

## Key Conventions

- **API prefix:** all backend routes are prefixed with `/api`.
- **Data access is isolated behind a repository layer** — business logic never reads/writes the JSON store directly; always go through a repository class. This keeps unit tests mockable.
- **Frontend fetches via a single `api/` module** — components never call `fetch` directly; all HTTP calls go through a typed client in `frontend/src/api/`.
- **Gap calculation:** `gap = skill.targetLevel - engineer.skillLevels[skillId]` (positive = engineer is below target).
- **Heatmap color scale:** green (≥ target), yellow (1 below), orange (2 below), red (≥ 3 below).

## Testing Requirements

- All backend business logic must be covered by **unit tests using Jest**. Mock the repository layer to isolate logic from the data store.
- All major user flows must be covered by **Playwright browser tests** (skills CRUD, engineer profile editing, heatmap interaction, gap analysis view).
- Target ≥ 80% line coverage on the backend.

## Feature Areas

| Feature | Description |
|---|---|
| Skills Inventory | CRUD for skills and their target levels |
| Engineer Inventory | Browse engineers by team/role, link to profiles |
| Engineer Profile | View and edit an engineer's competency levels per skill |
| Team Heatmap | Grid of engineers × skills; color-coded; inline editing |
| Gap Analysis | Skills ranked by largest delta (target vs team average) |
| Training Recommendations | Per-engineer list of skills furthest below target |
