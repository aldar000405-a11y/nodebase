"use client";

import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import type { AppRouter } from "./routers/-app";
import SuperJSON from "superjson";

function getUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const trpc = createTRPCReact<AppRouter>();

let trpcClientCache: any = undefined;

export function useTRPC() {
  if (!trpcClientCache) {
    const client = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: SuperJSON,
          url: getUrl(),
        }),
      ],
    });
    trpcClientCache = client;
  }
  return trpcClientCache;
}

type TRPCReactProviderProps = {
  children: React.ReactNode;
  initialState?: DehydratedState | null | undefined;
};

export function TRPCReactProvider({
  children,
  initialState,
}: TRPCReactProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: SuperJSON,
          url: `${getUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={initialState}>{children}</HydrationBoundary>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
