"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type DishFormState = { error?: string; success?: string };

const DEFAULT_DISH_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadImage(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Images must be under 5 MB.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Upload an image file.");
  }
  const uploaded = await put(`dishes/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
  });
  return uploaded.url;
}

export async function saveDishAction(
  _previousState: DishFormState,
  formData: FormData,
): Promise<DishFormState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "COOK") {
    return { error: "Please sign in as a cook to manage dishes." };
  }

  const profile = await prisma.cookProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) return { error: "No cook profile found for this account." };

  const id = formData.get("id")?.toString() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const price = Number(formData.get("price"));
  const prepTime = formData.get("prepTime")?.toString().trim() ?? "";
  const categoryName = formData.get("category")?.toString() ?? "";
  const tags = (formData.get("tags")?.toString() ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const file = formData.get("image");

  if (!name || !description || !Number.isFinite(price) || price <= 0 || !prepTime || !categoryName) {
    return { error: "Fill in all fields. Price must be greater than zero." };
  }

  const category = await prisma.category.findUnique({ where: { name: categoryName } });
  if (!category) return { error: "Pick a category from the list." };

  let image: string | undefined;
  if (file instanceof File && file.size > 0) {
    try {
      image = await uploadImage(file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Could not upload the image." };
    }
  }

  if (id) {
    const dish = await prisma.dish.findFirst({ where: { id, cookId: profile.id } });
    if (!dish) return { error: "This dish does not belong to your profile." };

    await prisma.dish.update({
      where: { id },
      data: {
        name,
        description,
        price,
        prepTime,
        tags,
        categoryId: category.id,
        ...(image ? { image } : {}),
      },
    });
    revalidatePath("/cook/manage");
    return { success: "Dish updated." };
  }

  const baseSlug = slugify(name) || "dish";
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.dish.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${attempt++}`;
  }

  await prisma.dish.create({
    data: {
      slug,
      name,
      description,
      price,
      prepTime,
      tags,
      categoryId: category.id,
      image: image ?? DEFAULT_DISH_IMAGE,
      cookId: profile.id,
    },
  });
  revalidatePath("/cook/manage");
  return { success: "Dish added to your menu." };
}

export async function deleteDishAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "COOK") {
    redirect("/login");
  }

  const id = formData.get("id")?.toString() ?? "";
  const profile = await prisma.cookProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (profile) {
    await prisma.dish.deleteMany({ where: { id, cookId: profile.id } });
  }

  revalidatePath("/cook/manage");
  redirect("/cook/manage");
}

export async function saveAvatarAction(
  _previousState: DishFormState,
  formData: FormData,
): Promise<DishFormState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "COOK") {
    return { error: "Please sign in as a cook to change your photo." };
  }

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a photo to upload." };
  }

  let avatar: string;
  try {
    avatar = await uploadImage(file);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not upload the photo." };
  }

  await prisma.cookProfile.update({
    where: { userId: session.user.id },
    data: { avatar },
  });
  revalidatePath("/cook/manage");
  revalidatePath("/cook/[slug]");
  return { success: "Profile photo updated." };
}
