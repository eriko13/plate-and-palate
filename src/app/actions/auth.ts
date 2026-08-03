"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { Role } from "@/generated/prisma/client";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type AuthFormState = {
  error?: string;
};

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().toLowerCase().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const roleValue = formData.get("role")?.toString() === "COOK" ? Role.COOK : Role.BUYER;

  if (!name || !email || password.length < 8) {
    return { error: "Name, email, and a password of at least 8 characters are required." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: roleValue,
    },
  });

  if (roleValue === Role.COOK) {
    const baseSlug = slugify(name) || "cook";
    let slug = baseSlug;
    let attempt = 1;
    while (await prisma.cookProfile.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${attempt++}`;
    }

    await prisma.cookProfile.create({
      data: {
        userId: user.id,
        slug,
        handle: `@${slug.replace(/-/g, "")}`,
        location: "Rexburg, ID",
        bio: "Sharing homemade food with neighbors.",
        story: "I joined Plate & Palate to share the dishes I love cooking at home.",
        avatar:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=85",
        specialty: "Homemade favorites",
      },
    });
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: roleValue === Role.COOK ? "/cook/manage" : "/browse",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Try logging in." };
    }
    throw error;
  }

  return {};
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email")?.toString().toLowerCase().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/browse",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  return {};
}

export async function signOutAction() {
  const { signOut } = await import("@/auth");
  await signOut({ redirectTo: "/" });
}
