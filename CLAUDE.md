# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint (max-warnings=0, treat warnings as errors)
npm run lint-typescript  # ESLint + TypeScript type-check
npm run type-check   # TypeScript compiler check only (no emit)
npm run test         # Run Jest tests
npm run watch        # Jest watch mode
```

**Run a single test file:**
```bash
npx jest server/service/inviteService.test.ts
npx jest --testPathPattern="inviteService"
```

## Architecture

Next.js 15 App Router app (TypeScript, strict mode) backed by AWS DynamoDB (single-table design) with NextAuth v5 Google OAuth.

### Layer Structure

```
app/api/trips/         → API route handlers (HTTP layer)
server/service/        → Business logic (services)
server/db/             → DynamoDB query/transaction builders
lib/                   → Shared utilities and custom hooks
types/                 → TypeScript type definitions
```

**Request flow:** API route → service (permission check) → DB transaction builder → DynamoDB

### Permissions System

`types/permissions.ts` defines roles (`OWNER`, `INVITEE`, `PUBLIC`) and actions (`VIEW`, `EDIT`, `DELETE`, `INVITE`, `COMMENT`, `RSVP`, `REACT`). `server/service/tripPermissionsService.ts` enforces these. Every mutating API route checks permissions before proceeding.

### DynamoDB Single-Table Schema

The table uses composite keys — see `server/db/dbKeys.ts` for key construction helpers.

| Access Pattern | PK | SK |
|---|---|---|
| User's trips | `CREATEDBY#{userId}` | `{tripId}` |
| Public trips by tag | `TAG#PUBLIC#{tagName}` | `{tripId}` |
| Private trips by tag | `TAG#PRIVATE#{tagName}` | `{tripId}` |
| Invitee access | `INVITEES#{email}` | `{tripId}` |
| Trip metadata | `TRIP#{tripId}` | `METADATA` |
| Comments | `TRIP#{tripId}` | `COMMENT#{commentId}` |

When modifying trips, multiple items are written in a single transaction to keep all access patterns consistent.

### API Routes

All trip routes live under `app/api/trips/`:
- `POST /api/trips` — create
- `GET/PATCH/DELETE /api/trips/[tripId]` — single trip
- `GET/POST /api/trips/[tripId]/comments` — comments
- `GET/POST /api/trips/[tripId]/invites` — invitations
- `GET /api/trips/type/[type]` — filter by type (`public` | `myTrips`)
- `GET /api/trips/tags/[tagName]` — filter by tag

### Auth

`middleware.ts` uses NextAuth to protect routes. `auth.ts` configures the Google OAuth provider. Session user is available via `auth()` in server components and API routes.

### Frontend Components

Components live in `app/components/` organized by feature:
- `trips/trip-form/` — create/edit trip form (uses `lib/hooks/useTripForm.ts`)
- `trips/` — trip display components (cards, detail views)
- `site-wide/` — Navbar, ThemeProvider (dark mode via Tailwind class strategy)
- `ui/` — shared UI primitives (Radix UI + Shadcn)

### Path Aliases

`tsconfig.json` maps `@/*` to the project root. Use `@/lib/...`, `@/types/...`, `@/server/...` etc.

## Testing

Jest + jsdom + React Testing Library + SWC transpiler. Tests co-located with source files (`*.test.ts` / `*.test.tsx`). Service and DB layer tests use Jest mocks for DynamoDB. A `jest.setup.js` file polyfills `TextEncoder` and `ResizeObserver` for jsdom.

## Environment Variables

Required in `.env.local`:
```
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-west-2
TRIP_PLANNER_TABLE_NAME=trip-planner-dev
```

## Key Notes

- **`next.config.ts`** disables React strict mode to prevent double API calls in development.
- **IDs** are generated with ULID (`ulid` package) for sortable unique IDs.
- **ESLint** is configured to allow `any` types and unused variables (`.eslintrc.json`) — the stricter check is `lint-typescript` which runs `tsc`.
- **Husky** runs pre-commit hooks; check `.husky/` if hooks are blocking commits.
