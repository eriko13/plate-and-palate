import { prisma } from "@/lib/prisma";
import type { Cook, Dish, DishFilters } from "@/lib/types";

export type { Cook, Dish, DishFilters };

function toCook(profile: {
  slug: string;
  handle: string;
  location: string;
  bio: string;
  story: string;
  avatar: string;
  specialty: string;
  user: { name: string | null };
}): Cook {
  return {
    slug: profile.slug,
    name: profile.user.name ?? "Cook",
    handle: profile.handle,
    location: profile.location,
    bio: profile.bio,
    story: profile.story,
    avatar: profile.avatar,
    specialty: profile.specialty,
  };
}

function toDish(dish: {
  slug: string;
  name: string;
  description: string;
  price: { toNumber(): number } | number;
  image: string;
  prepTime: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  category: { name: string };
  cook: { slug: string };
}): Dish {
  return {
    slug: dish.slug,
    name: dish.name,
    description: dish.description,
    price: typeof dish.price === "number" ? dish.price : dish.price.toNumber(),
    category: dish.category.name,
    image: dish.image,
    cookSlug: dish.cook.slug,
    rating: dish.rating,
    reviewCount: dish.reviewCount,
    prepTime: dish.prepTime,
    tags: dish.tags,
  };
}

export async function getCooks(): Promise<Cook[]> {
  const profiles = await prisma.cookProfile.findMany({
    include: { user: true },
    orderBy: { slug: "asc" },
  });
  return profiles.map(toCook);
}

export async function getCook(slug: string): Promise<Cook | undefined> {
  const profile = await prisma.cookProfile.findUnique({
    where: { slug },
    include: { user: true },
  });
  return profile ? toCook(profile) : undefined;
}

export async function getDishes(filters: DishFilters = {}): Promise<Dish[]> {
  const { q, category, minPrice, maxPrice } = filters;

  const dishes = await prisma.dish.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { cook: { user: { name: { contains: q, mode: "insensitive" } } } },
              ],
            }
          : {},
        category && category !== "All dishes"
          ? { category: { name: category } }
          : {},
        minPrice != null || maxPrice != null
          ? {
              price: {
                ...(minPrice != null ? { gte: minPrice } : {}),
                ...(maxPrice != null ? { lte: maxPrice } : {}),
              },
            }
          : {},
      ],
    },
    include: {
      category: true,
      cook: true,
    },
    orderBy: { name: "asc" },
  });

  return dishes.map(toDish);
}

export async function getDish(slug: string): Promise<Dish | undefined> {
  const dish = await prisma.dish.findUnique({
    where: { slug },
    include: { category: true, cook: true },
  });
  return dish ? toDish(dish) : undefined;
}

export async function getCookDishes(cookSlug: string): Promise<Dish[]> {
  const dishes = await prisma.dish.findMany({
    where: { cook: { slug: cookSlug } },
    include: { category: true, cook: true },
    orderBy: { name: "asc" },
  });
  return dishes.map(toDish);
}

export async function getCategories(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });
  return categories.map((category) => category.name);
}
