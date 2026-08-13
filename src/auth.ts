import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import type { Role } from "@/generated/prisma/client";

declare module "next-auth" {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

type AppJWT = {
  id?: string;
  role?: Role;
  email?: string | null;
};

const providers: Provider[] = [
  Credentials({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toString().toLowerCase().trim();
      const password = credentials?.password?.toString();
      if (!email || !password) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;

      const valid = await compare(password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      };
    },
  }),
];

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async jwt({ token, user }) {
      const appToken = token as typeof token & AppJWT;
      if (user) {
        appToken.id = user.id;
        appToken.role = user.role ?? "BUYER";
      } else if (appToken.email && !appToken.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: appToken.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          appToken.id = dbUser.id;
          appToken.role = dbUser.role;
        }
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
});
