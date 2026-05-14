import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  github: {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  },
  // google: {
  //   clientId: process.env.GOOGLE_CLIENT_ID as string,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  // },
  plugins: [tanstackStartCookies()],
});
