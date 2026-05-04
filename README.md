# Prompt Mastery

Prompt Mastery is a full-stack app that helps developers produce higher-quality AI build prompts using a guided multi-step questionnaire.

## Stack
- Frontend: Next.js (App Router), React, TypeScript, Tailwind
- Backend: Express 5, Prisma Client, PostgreSQL driver adapter
- Persistence: PostgreSQL (with graceful preview-only fallback when DB is unavailable)

## Core Flow
1. User answers guided questions in `/builder`
2. Backend validates and normalizes payloads
3. Prompt and recommendations are generated
4. Results page supports copy, recommendation merge, tag filtering, and regenerate-from-same-inputs

## API Contract
All endpoints now use a consistent envelope:

- Success: `{ "success": true, "data": ... }`
- Failure: `{ "success": false, "error": { "code": "...", "message": "...", "details": ... } }`

### Endpoints
- `GET /_/backend/health/live` liveness health check
- `GET /_/backend/health/ready` readiness check with database probe
- `GET /api/questions` questions + questionnaire contract metadata
- `GET /api/projects?page=1&limit=10` paginated project list
- `GET /api/projects/:id` single project
- `POST /api/projects` create project
- `PUT /api/projects/:id` update project
- `DELETE /api/projects/:id` delete project
- `POST /api/generate` generate prompt/recommendations (no persistence)
- `POST /api/generate/save` generate and persist; returns `status: "preview_only"` when DB save is unavailable
- `GET /api/generate/:projectId` fetch saved generation data

### Generation Modes
Supported by `POST /api/generate` and `POST /api/generate/save`:
- `quick`
- `balanced` (default)
- `strict-spec`

## Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Testing

### Backend tests
```bash
cd backend
npm test
```

### Frontend lint
```bash
cd frontend
npm run lint
```

### Frontend E2E
```bash
cd frontend
npm run e2e
```

Notes:
- E2E expects frontend and backend to be running.
- CI installs Playwright Chromium automatically.

## CI
GitHub Actions workflow (`.github/workflows/ci.yml`) runs:
1. Backend tests
2. Frontend lint
3. Frontend E2E (critical builder -> generate -> results flow)
