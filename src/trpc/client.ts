// Re-export all from client.tsx - this file exists because TypeScript prefers .ts over .tsx
// The actual implementation is in client.tsx
export { TRPCReactProvider, useTRPC } from "./client.tsx";
