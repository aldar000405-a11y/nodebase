"use client"; // Added directive

import type { Metadata } from "next"; // Keep Metadata type import for completeness, though it's not used in client components directly
import { Provider } from "jotai";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { SubscriptionRefresher } from "@/components/SubscriptionRefresher"; // Import the new component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Removed export const metadata as it's not applicable to client components in this direct form for server-side metadata.
// For client components, metadata should be defined in a layout.tsx (server component) or page.tsx (server component)
// or using generateMetadata function. Keeping it here would cause a build error.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}
      >
        <div className="flex flex-col h-full w-full">
          <TRPCReactProvider>
            <NuqsAdapter>
              <Provider>
                {children}
                <Toaster />
                <SubscriptionRefresher /> {/* Add the refresher here */}
              </Provider>
            </NuqsAdapter>
          </TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
