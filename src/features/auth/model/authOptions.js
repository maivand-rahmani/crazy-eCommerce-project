import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "../../../../prisma/client";
import { getAuthSecret } from "@/shared/lib/auth";
import { sanitizeUser } from "@/shared/lib/auth";
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
          select: {
            role: true,
            isBlocked: true,
            deletedAt: true,
            name: true,
            email: true,
            image: true,
          },
        });

        token.role = dbUser?.role;
        token.isBlocked = dbUser?.isBlocked;
        token.deletedAt = dbUser?.deletedAt ? dbUser.deletedAt.toISOString() : null;
        token.name = dbUser?.name ?? token.name;
        token.email = dbUser?.email ?? token.email;
        token.picture = dbUser?.image ?? token.picture;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        Object.assign(
          session.user,
          sanitizeUser({
            id: token.id,
            role: token.role,
            isBlocked: token.isBlocked,
            deletedAt: token.deletedAt,
            name: token.name,
            email: token.email,
            image: token.picture,
          }),
        );
      }
      return session;
    },
  },
};
