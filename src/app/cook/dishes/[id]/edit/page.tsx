import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DishForm } from "@/components/DishForm";
import { getCategories } from "@/lib/data";

export default async function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await prisma.cookProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) redirect("/register");

  const { id } = await params;
  const dish = await prisma.dish.findFirst({
    where: { id, cookId: profile.id },
    include: { category: true },
  });
  if (!dish) notFound();

  const categories = await getCategories();

  return (
    <>
      <Header />
      <main id="main" className="page-shell auth-page">
        <section className="auth-panel">
          <div className="eyebrow">Cook dashboard</div>
          <h1>Edit dish</h1>
          <p className="muted">Update the details for {dish.name}.</p>
          <DishForm
            categories={categories}
            dish={{
              id: dish.id,
              name: dish.name,
              description: dish.description,
              price: Number(dish.price),
              prepTime: dish.prepTime,
              tags: dish.tags,
              category: dish.category.name,
            }}
          />
          <Link className="text-link" href="/cook/manage" style={{ display: "inline-block", marginTop: 18 }}>
            Back to your menu
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
