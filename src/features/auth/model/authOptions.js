import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "../../../../prisma/client";
import { getAuthSecret } from "@/shared/lib/auth";
import { authorizeUser } from "./authorizeUser";

export const authOptions = {
  session: { strategy: "jwt" },
  secret: getAuthSecret(),
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: authorizeUser,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.id) return true;

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { isBlocked: true, deletedAt: true },
      });

      return Boolean(dbUser && !dbUser.isBlocked && !dbUser.deletedAt);
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, isBlocked: true, deletedAt: true },
        });

        token.role = dbUser?.role;
        token.isBlocked = dbUser?.isBlocked;
        token.deletedAt = dbUser?.deletedAt ? dbUser.deletedAt.toISOString() : null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isBlocked = Boolean(token.isBlocked);
        session.user.deletedAt = token.deletedAt ?? null;
      }
      return session;
    },
  },
};
