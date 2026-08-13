import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/generated/prisma/client";

type AppJWT = {
  id?: string;
  role?: Role;
  email?: string | null;
};

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      const appToken = token as typeof token & AppJWT;
      if (user) {
        appToken.id = user.id;
        appToken.role = user.role ?? "BUYER";
      }
      return appToken;
    },
    async session({ session, token }) {
      const appToken = token as typeof token & AppJWT;
      if (session.user) {
        session.user.id = appToken.id ?? "";
        session.user.role = appToken.role ?? "BUYER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
