import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../../prisma/client";
import { authorizeUser } from '@/features/auth';

export const authParams = {
    session: { strategy: "jwt" },
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
  async jwt({ token, user }) {

    if (user) {
      token.id = user.id;
    }

    if (token.id) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true }
        });

        token.role = dbUser?.role;
      } catch (error) {
        console.error("Failed to fetch user role in jwt callback:", error);
        // Keep token but without role rather than crashing
      }
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.role = token.role;
    }
    return session;
  }
}

};

const handler = NextAuth(authParams);
export { handler as GET, handler as POST };