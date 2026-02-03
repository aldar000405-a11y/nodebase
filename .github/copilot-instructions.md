# Copilot instructions (NodeBase)

> **For AI coding agents:**
>
> This document provides essential guidance for working productively in the NodeBase codebase. It summarizes the architecture, critical workflows, and project-specific conventions as of February 2026. Follow these instructions to ensure your contributions align with established patterns and practices.

## Big picture

**NodeBase is a Next.js 15 (App Router) workflow automation platform** with a PostgreSQL database (Prisma), featuring visual node-based workflow editor, Inngest task queue, and Polar monetization integration.

**Data flow:**

1. Next.js RSC pages preload data with tRPC + React Query
2. tRPC routers delegate to Prisma ORM for data access
3. Workflow execution via Inngest async jobs topological node execution
4. Real-time updates via Inngest realtime middleware
5. Auth via Better-Auth (email + OAuth providers)

**Key tech stack:**

- **Frontend:** Next.js 15 (App Router), React 19, Radix UI, TailwindCSS, React Query + tRPC hooks, XYFlow for node editor
- **Backend:** Node.js, tRPC v11, Prisma 6
- **Database:** PostgreSQL with Prisma migrations
- **Jobs/Events:** Inngest (async function orchestration + realtime channels)
- **Auth:** Better-Auth + Polar integration for payments
- **Templating:** Handlebars (in node executors for dynamic data substitution)
- **Linting:** Biome (formatter + linter)

## Critical workflows

**Development:**

- Start all services: `pnpm dev:all` (uses mprocs.yaml to run Next.js + Inngest CLI in parallel)
- Inngest dev server: `pnpm inngest:dev` (required for local job processing)
- Lint & format: `pnpm lint` and `pnpm format` (Biome rules in biome.json)

**Database:**

- After schema changes: `prisma-migrate-dev` tool (generates migrations, applies them, regenerates Prisma Client)
- Reset database (dev only): `prisma-migrate-reset` tool (drops schema, reapplies migrations, runs seeds)
- Prisma Client outputs to `src/generated/prisma`
- Use singleton `prisma` from `src/lib/db.ts` (global cache in development)

**Type Safety:**

- Zod schemas validate tRPC inputs (`z.object(...)`)
- Prisma types auto-generated from schema
- SuperJSON serialization for complex types across tRPC/React Query boundary

## tRPC + React Query patterns (critical)

**Router structure:**

- Feature routers in `src/features/{feature}/server/routers.ts` (e.g., workflows router)
- Composed into app router: `src/trpc/routers/-app.ts`
- Context includes `{ session, userId, prisma }` from `src/trpc/init.ts`

**Procedures (security levels):**

- `baseProcedure` - no auth
- `protectedProcedure` - requires login (validates userId + session.user)
- `premiumProcedure` - requires active Polar subscription (use for create/update/delete operations)

**Query/Mutation patterns:**

- Server pages: Prefetch with `prefetch(...)` from `src/trpc/server.tsx` `<HydrateClient>` boundary `<Suspense>` wrapper
- Client components: Use hooks like `useSuspenseWorkflows()` that call `useSuspenseQuery(trpc.workflows.getMany.queryOptions(...))`
- Mutations: `useMutation(trpc.workflows.create.mutationOptions({ onSuccess: () => queryClient.invalidateQueries(...) }))`
- Always invalidate related queries on mutation success (e.g., create workflow invalidates getMany and getOne)

**Client cache config:**

- staleTime: 60s (fresh data, no refetch)
- gcTime: 5min (keep in cache)
- refetchOnMount: false
- refetchOnWindowFocus: false

## Workflows feature conventions

**Query parameter management (nuqs library):**

- Define params: `src/features/workflows/params.ts` (e.g., page, pageSize, search with defaults)
- Server parsing: `src/features/workflows/params.server.ts` + `src/features/workflows/server/params-loader.ts`
- Client hook: `useWorkflowsParams()` `useQueryStates(workflowsParams)` for URL sync
- Page.tsx: `await workflowsParamsLoader(searchParams)` to parse + validate

**Server-side prefetch helpers:**

- File: `src/features/workflows/server/prefetch.ts`
- Export functions like `prefetchWorkflows(params)` and `prefetchWorkflow(id)` that use `trpc.workflows.getMany.queryOptions(params)`
- Call from RSC before rendering suspended components

## Auth & Access Control

**Better-Auth setup:**

- Config: `src/lib/auth.ts` with Prisma adapter, email/password signup, Polar plugin for payments
- Check auth: `requireAuth()` from `src/lib/auth-utils.ts` in RSC pages (throws if not logged in)
- Client auth: `authClient` from `src/lib/auth-client.ts` for client-side auth checks

**Data isolation:**

- Every tRPC procedure receives `ctx.userId` (from session)
- Always filter Prisma queries by `userId` in where clauses (see workflows router)
- Example: `await prisma.workflow.findFirst({ where: { id, userId: ctx.userId } })`

## Workflow Execution

**Inngest job processing:**

- Trigger via tRPC: `await inngest.send({ name: "workflows/execute.workflow", data: { workflowId } })`
- Function definition: `src/inngest/function.ts` - `executeWorkflow` function
- Execution flow:
  1. Fetch workflow + all nodes + connections
  2. Topological sort nodes (ensures dependencies execute first)
  3. For each node: get executor via `getExecutor(nodeType)` execute with context
  4. Context flows through nodes (output from one becomes input to next)

**Node types & executors:**

- Enum: `NodeType` (INITIAL, MANUAL_TRIGGER, HTTP_REQUEST, etc.)
- Registry: `src/features/executions/lib/executor-registry.ts` maps NodeType → executor function
- Nodes store `position: Json` (x,y coordinates), `data: Json` (config), and support named I/O (`fromOutput`, `toInput`)
- Executors receive `{ data, nodeId, context, step, publish }` and return updated context for next node
- Node data uses `(())` syntax (e.g., `((userId))`) which preprocessor converts to Handlebars `{{}}` before execution

**Realtime updates:**

- Inngest realtime middleware enabled in `src/inngest/client.ts` (realtimeMiddleware)
- Define channels for publishing updates: `src/inngest/channels/http-request.ts`
- Use `publish(channel.status({ nodeId, status }))` in executors to broadcast job progress to UI
- Status flow: client subscribes to realtime updates and re-renders based on node execution status

## When making changes

**Adding new tRPC endpoint:**

1. Define input schema with Zod in `src/features/{feature}/server/routers.ts`
2. Add procedure: `newEndpoint: protectedProcedure.input(z.object(...)).mutation/query(async ({ input, ctx }) => { ... })`
3. Compose into feature router (already imported in -app.ts)
4. Create/update feature hook in `src/features/{feature}/hooks/` using `useMutation(trpc.feature.newEndpoint.mutationOptions(...))`
5. If server-side rendered: add `prefetch` helper in `src/features/{feature}/server/prefetch.ts`

**Adding new node type:**

1. Add enum variant to `NodeType` in `prisma/schema.prisma`
2. Run `prisma-migrate-dev` tool
3. Create executor: `src/features/executions/components/{nodeType}/executor.ts` exporting `{nodeType}Executor: NodeExecutor`
4. Register in `src/features/executions/lib/executor-registry.ts` executorRegistry mapping
5. Create UI component: `src/features/executions/components/{nodeType}/node.tsx` (extends BaseExecutionNode)
6. Add to node selector if user-facing: `src/features/editor/components/node-selector.tsx`

**Database migrations:**

- Modify `prisma/schema.prisma`
- Run `prisma-migrate-dev` (generates migration in `prisma/migrations/`)
- Prisma Client auto-regenerates in `src/generated/prisma`

**Formatting & linting:**

- Run `pnpm format` before committing (Biome)
- Biome rules: `next` and `react` recommended sets enabled
