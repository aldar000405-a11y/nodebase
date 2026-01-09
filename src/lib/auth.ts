import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma,{
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignup: true,
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
                }
            ],
            successUrl: process.env.POLAR_SUCCESS_URL,
            authenticatedUsersOnly: true,
        }),
        portal(),
          

        ],
    })
    ]
});

   
