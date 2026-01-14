"use client";

import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
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

function makeQueryClient() {
  return new QueryClient();
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

let browserTRPCClient: ReturnType<typeof createTRPCClient<AppRouter>> | undefined;
let browserTRPCOptions: ReturnType<typeof createTRPCOptionsProxy<AppRouter>> | undefined;

function getTRPCClient() {
  const client = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        transformer: SuperJSON,
        url: `${getUrl()}/api/trpc`,
      }),
    ],
  });

  if (typeof window === "undefined") {
    return client;
  }
  if (!browserTRPCClient) browserTRPCClient = client;
  return browserTRPCClient;
}

export function useTRPC() {
  const queryClient = getQueryClient();
  const client = getTRPCClient();

  if (typeof window === "undefined") {
    return createTRPCOptionsProxy<AppRouter>({
      client,
      queryClient,
    });
  }

  if (!browserTRPCOptions) {
    browserTRPCOptions = createTRPCOptionsProxy<AppRouter>({
      client,
      queryClient,
    });
  }

  return browserTRPCOptions;
}

type TRPCReactProviderProps = {
  children: React.ReactNode;
  initialState?: DehydratedState | null | undefined;
};

export function TRPCReactProvider({
  children,
  initialState,
}: TRPCReactProviderProps) {
  const [queryClient] = useState(getQueryClient);
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
