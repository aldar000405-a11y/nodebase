"use client";

import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { useState } from "react";
import type { AppRouter } from "./routers/-app";

let queryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient();
  }
  if (!queryClient) {
    queryClient = new QueryClient();
  }
  return queryClient;
}

function getUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function useTRPC() {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  });
}

export function TRPCReactProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: DehydratedState | null | undefined;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={initialState}>
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
