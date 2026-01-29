
# Copilot instructions (NodeBase)

> **For AI coding agents:**
>
> This document provides essential, up-to-date guidance for working productively in the NodeBase codebase. It summarizes the architecture, critical workflows, and project-specific conventions as of January 2026. Follow these instructions to ensure your contributions align with established patterns and practices.

## Big picture


## Critical workflows


## tRPC + React Query patterns (important)

  - Prefetch on the server with `prefetch(...)` from `src/trpc/server.tsx` (see `src/features/workflows/server/prefetch.ts`).
  - Wrap client components in `<HydrateClient>` and render with `<Suspense>` (see `src/app/(dashboard)/(rest)/workflows/page.tsx`).

## Workflows feature conventions

  - Shared params in `src/features/workflows/params.ts`
  - Server parsing via `src/features/workflows/params.server.ts` + `src/features/workflows/server/params-loader.ts`
  - Client state via `src/features/workflows/hooks/use-workflows-params.ts`

## Auth conventions


## Data access


## UI conventions


## When making changes

  - Add it to the feature router (e.g. `src/features/workflows/server/routers.ts`),
  - Use `queryOptions`/`mutationOptions` from `useTRPC()` in a feature hook,
  - Add an RSC prefetch helper if it’s used in a server page.
