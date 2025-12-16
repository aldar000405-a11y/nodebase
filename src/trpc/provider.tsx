"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/trpc/client";

const queryClient = new QueryClient();

interface TRPCProviderProps {
  children: ReactNode;
}

export const TRPCProvider = ({ children }: TRPCProviderProps) => {
  return (
    <trpc.Provider queryClient={queryClient} client={trpc.createClient({ url: "/api/trpc" })}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
