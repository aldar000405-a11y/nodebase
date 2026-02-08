import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    // WARNING: `trustHost: true` can be a security risk if the application is
    // deployed behind a reverse proxy that doesn't correctly set the
    // `X-Forwarded-Host` header, or if the application is susceptible to
    // Host header injection attacks.
    // It tells `better-auth` to trust the `Host` header for determining
    // the callback URL, which can be manipulated in certain scenarios.
    // Ensure proper proxy configuration or consider setting to `false`
    // and explicitly configuring the `url` option if there are concerns.
    trustHost: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignup: true,
    requireEmailVerification: false,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignup: true,
      use: [
        checkout({
          products: [
            {
              // productId: "f9346d5e-ffab-48ea-96cf-60870e04e1ce",
              productId: "7ff16f6f-0bbb-4446-910a-a853106d4239",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
