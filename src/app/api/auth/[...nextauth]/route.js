import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../../prisma/client";
import { authorizeUser } from '@/shared/lib/auth/authorizeUser'

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
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id },
        select: { role: true }
      });

      token.role = dbUser?.role;
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