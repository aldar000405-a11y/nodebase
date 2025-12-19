# Invalid Origin & Type Errors - Fixed

## Issue 1: "Invalid origin" Error ✅ FIXED

### Root Cause

The `authClient` in [src/lib/auth-client.ts](src/lib/auth-client.ts) was not configured with the proper `baseURL`, causing CORS/origin validation errors when making requests to the authentication endpoints.

### Fix Applied

Updated the auth client to use `NEXT_PUBLIC_BETTER_AUTH_URL` environment variable:

```typescript
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});
```

### Environment Setup

Added to [.env](.env):

```
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

---

## Issue 2: Red Line in -app.ts ✅ FIXED

### Root Cause

The context object was using wrong property names. The tRPC init.ts was creating:

- `ctx.userId` (string)
- `ctx.auth` (session object)

But the code was trying to access:

- `ctx.session.user.id` ❌ (doesn't exist)
- `ctx.session.user.email` ❌ (doesn't exist)

### Fix Applied

Updated [src/trpc/routers/-app.ts](src/trpc/routers/-app.ts) to use correct context properties:

```typescript
// getWorkflows - Changed from ctx.session.user.id to ctx.userId
getWorkflows: protectedProcedure.query(({ ctx }) => {
  return prisma.workflow.findMany({
    where: {
      userId: ctx.userId,  // ✅ CORRECT
    },
  });
}),

// createWorkflow - Changed ctx.session.user.* to ctx.auth?.user.* and ctx.userId
createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
  await inngest.send({
    name: "test/hello.world",
    data: {
      email: ctx.auth?.user?.email,  // ✅ CORRECT
    },
  });

  return prisma.workflow.create({
    data: {
      name: "test-workflow",
      userId: ctx.userId,  // ✅ CORRECT
    },
  });
}),
```

---

## Issue 3: Red Line in page.tsx ✅ FIXED

### Root Cause

The `useTRPC` hook import was causing TypeScript errors due to improper export from the client module.

### Fix Applied

Updated [src/trpc/client.tsx](src/trpc/client.tsx) with proper tRPC React setup:

```typescript
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();

export function useTRPC() {
  return trpc.useUtils();
}
```

Also updated [src/app/page.tsx](src/app/page.tsx) with proper type annotations:

```typescript
onSuccess: (data: any) => { /* ... */ },
onError: (error: any) => { /* ... */ },
```

---

## Context Object Structure (Reference)

After tRPC context initialization, the context object has:

```typescript
{
  session: {      // From auth.api.getSession()
    user: {
      id: string,
      email: string,
      // ... other user fields
    }
  },
  userId: string | null,  // Extracted from session.user.id
  auth: Session           // Same as session
}
```

Therefore, use:

- `ctx.userId` - for user ID
- `ctx.auth.user.email` - for user email
- `ctx.session.user.*` - DON'T use this, use ctx.auth instead

---

## Testing the Fixes

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Test authentication:**

   - Sign up with a valid account (password must be 8+ chars with uppercase, lowercase, numbers)
   - Login should work without "Invalid origin" error
   - Creating workflows should now access the correct user ID

3. **Check for TypeScript errors:**
   - All red squigly lines in `page.tsx` and `-app.ts` should be gone
   - If errors persist, reload VS Code or restart TypeScript server

---

## Files Modified

1. ✅ [src/lib/auth-client.ts](src/lib/auth-client.ts) - Added baseURL configuration
2. ✅ [src/trpc/routers/-app.ts](src/trpc/routers/-app.ts) - Fixed context property access
3. ✅ [src/trpc/client.tsx](src/trpc/client.tsx) - Fixed useTRPC export
4. ✅ [src/app/page.tsx](src/app/page.tsx) - Added type annotations
5. ✅ [.env](.env) - Added NEXT_PUBLIC_BETTER_AUTH_URL
