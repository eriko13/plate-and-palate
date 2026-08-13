"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type RequestFormState = { error?: string; success?: string };

export async function saveDishRequestAction(_previousState: RequestFormState, formData: FormData): Promise<RequestFormState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "BUYER") {
    return { error: "Please sign in as a buyer to contact this cook." };
  }

  const slug = formData.get("slug")?.toString() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";
  if (!slug || message.length < 10 || message.length > 1000) {
    return { error: "Your message must be between 10 and 1,000 characters." };
  }

  const dish = await prisma.dish.findUnique({ where: { slug }, select: { id: true } });
  if (!dish) return { error: "This dish is no longer available." };

  await prisma.dishRequest.upsert({
    where: { dishId_buyerId: { dishId: dish.id, buyerId: session.user.id } },
    create: { dishId: dish.id, buyerId: session.user.id, message },
    update: { message },
  });

  revalidatePath(`/dishes/${slug}`);
  revalidatePath("/cook/manage");
  return { success: "Your request has been sent to the cook." };
}
