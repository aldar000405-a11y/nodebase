import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma,{
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignup: true,
        requireEmailVerification: false,
    },
    secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-this",
    trustHost: true,
    });
   
