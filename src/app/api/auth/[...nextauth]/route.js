import NextAuth from "next-auth";
import { authOptions } from "@/features/auth/model/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
