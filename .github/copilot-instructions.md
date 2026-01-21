# Copilot instructions (NodeBase)

## Big picture

- Next.js App Router app under `src/app` (route groups like `(auth)` and `(dashboard)`), with API routes under `src/app/api/*`.
- Data layer is Prisma + Postgres (`prisma/schema.prisma`). Auth is BetterAuth + Prisma adapter, with Polar subscription gating.
- Backend RPC is tRPC (`src/trpc/*`) used from React Query (TanStack) with RSC prefetch + client hydration.
- Background/event work is Inngest (`src/app/api/inngest/route.ts`, functions in `src/inngest/function.ts`).

## Critical workflows

- Dev server: `pnpm dev` (Next).
- Run Next + Inngest together: `pnpm dev:all` (uses `mprocs.yaml`).
- Inngest dev: `pnpm inngest:dev` (check runs UI at `http://localhost:8288`).
- Lint/format: `pnpm lint` / `pnpm format` (Biome; config in `biome.json`).
- Local infra: `docker-compose up -d` (Postgres + Redis in `docker-compose.yml`).

## tRPC + React Query patterns (important)

- Server context + auth session lives in `src/trpc/init.ts` (`createTRPCContext` reads session from `next/headers`).
- Use `protectedProcedure` for logged-in routes and `premiumProcedure` for paid features (checks Polar in `src/trpc/init.ts` via `src/lib/polar.ts`).
- Client hooks use `useTRPC()` + `@tanstack/react-query` options, e.g. `trpc.workflows.getMany.queryOptions(...)` in `src/features/workflows/hooks/use-workflows.ts`.
- RSC prefetch + hydrate pattern:
  - Prefetch on the server with `prefetch(...)` from `src/trpc/server.tsx` (see `src/features/workflows/server/prefetch.ts`).
  - Wrap client components in `<HydrateClient>` and render with `<Suspense>` (see `src/app/(dashboard)/(rest)/workflows/page.tsx`).

## Workflows feature conventions

- Router: `src/features/workflows/server/routers.ts` (CRUD + list/pagination/search).
- URL params are managed with nuqs:
  - Shared params in `src/features/workflows/params.ts`
  - Server parsing via `src/features/workflows/params.server.ts` + `src/features/workflows/server/params-loader.ts`
  - Client state via `src/features/workflows/hooks/use-workflows-params.ts`

## Auth conventions

- BetterAuth config: `src/lib/auth.ts`; Next route handler: `src/app/api/auth/[...all]/route.ts`.
- Prefer `requireAuth()` / `requireUnauth()` in RSC pages (see `src/lib/auth-utils.ts`).

## Data access

- Prefer Prisma singleton from `src/lib/prisma.ts` in server code.
- BetterAuth currently uses the default export from `src/lib/db.ts` (also PrismaClient); keep this consistent when changing auth/database wiring.

## UI conventions

- UI primitives are in `src/components/ui/*` (shadcn/Radix style) and feature UIs live under `src/features/*`.

## When making changes

- If you add a new tRPC query/mutation:
  - Add it to the feature router (e.g. `src/features/workflows/server/routers.ts`),
  - Use `queryOptions`/`mutationOptions` from `useTRPC()` in a feature hook,
  - Add an RSC prefetch helper if it’s used in a server page.
- If you rename a hook/export, update all imports (Next/SWC errors are often “export doesn’t exist”).
