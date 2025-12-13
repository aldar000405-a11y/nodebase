"use client";

import { TRPCReactProvider } from "@/trpc/client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
}