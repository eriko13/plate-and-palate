"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ReviewFormState = { error?: string; success?: string };

export async function saveReviewAction(
  _previousState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in to leave a review." };

  const slug = formData.get("slug")?.toString() ?? "";
  const rating = Number(formData.get("rating"));
  const body = formData.get("body")?.toString().trim() ?? "";
  if (!slug || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Choose a rating from 1 to 5 stars." };
  }
  if (body.length < 10 || body.length > 1000) {
    return { error: "Your review must be between 10 and 1,000 characters." };
  }

  const dish = await prisma.dish.findUnique({
    where: { slug },
    select: { id: true, cook: { select: { userId: true } } },
  });
  if (!dish) return { error: "This dish is no longer available." };
  if (dish.cook.userId === session.user.id) {
    return { error: "You can't review your own dish." };
  }

  await prisma.review.upsert({
    where: { dishId_userId: { dishId: dish.id, userId: session.user.id } },
    create: { dishId: dish.id, userId: session.user.id, rating, body },
    update: { rating, body },
  });

  const summary = await prisma.review.aggregate({
    where: { dishId: dish.id },
    _avg: { rating: true },
    _count: { _all: true },
  });
  await prisma.dish.update({
    where: { id: dish.id },
    data: { rating: summary._avg.rating ?? 0, reviewCount: summary._count._all },
  });

  revalidatePath(`/dishes/${slug}`);
  revalidatePath("/browse");
  revalidatePath("/");
  return { success: "Thanks! Your review has been saved." };
}
