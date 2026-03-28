---
name: sdui-db-integration
description: Use this prompt when generating, fetching, or mutating SDUI JSON schemas via tRPC and rendering them in the UI.
---

# Context & Goal
You are implementing the core database integration for our Server-Driven UI (SDUI) engine. You need to connect the `UiSchema` Prisma model to the frontend `<SduiRenderer />` via tRPC.

# Tech Stack Rules
- **Database:** Prisma (v6).
- **API:** tRPC.
- **UI:** Next.js App Router, TailwindCSS, Shadcn UI.

# 🚨 Critical Instructions for this Task
1. **Prisma JSON Type Safety (CRITICAL):** Prisma returns JSON fields as `Prisma.JsonValue`. React components expect a strict `SduiNode` type. You MUST explicitly safely cast or parse this. 
   *Example:* `const uiNode = (uiSchema.jsonSchema as unknown) as SduiNode;`
2. **State Management in UI:**
   When loading a Project Version, handle these 3 states elegantly:
   - *Loading:* Show a Shadcn skeleton or spinner.
   - *Empty (No UiSchema):* Show a Shadcn `<Button>` labeled "✨ Generate UI with AI".
   - *Success:* Render the `<SduiRenderer node={uiNode} />`.
3. **Security (IDOR):**
   In the tRPC mutation (`generateMockUiSchema`), always verify that the `projectVersionId` belongs to a project owned by the currently authenticated user (`ctx.user.id`).
4. **Mock Generation:**
   When writing the mock generator, create a rich `SduiNode` tree (e.g., a Main Container, a Header Typography, a Subtitle Typography, and a Call-to-Action Button).
5. **Zero Errors:** Ensure `npx tsc --noEmit` and `npx biome check src/` pass completely before finishing.