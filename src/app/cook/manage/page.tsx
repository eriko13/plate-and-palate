import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export default async function ManageDishesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "COOK") redirect("/browse");

  const profile = await prisma.cookProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      dishes: {
        include: { category: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!profile) redirect("/register");

  return (
    <>
      <Header />
      <main className="page-shell">
        <div className="manage-grid">
          <section className="manage-panel">
            <div className="eyebrow">Cook dashboard</div>
            <h1>Your menu</h1>
            <p className="muted">
              Signed in as {session.user.name}. Full create/edit forms will connect here next —
              your live listings are below.
            </p>
            <Link className="button button-primary" style={{ marginTop: 18, width: "100%" }} href={`/cook/${profile.slug}`}>
              View public profile
            </Link>
          </section>
          <section>
            <div className="section-heading">
              <div>
                <div className="eyebrow">{profile.specialty}</div>
                <h2>Current listings</h2>
              </div>
              <span className="muted">{profile.dishes.length} dishes</span>
            </div>
            <div className="manage-list">
              {profile.dishes.map((dish) => (
                <article className="manage-item" key={dish.id}>
                  <Image
                    className="manage-item-image"
                    src={dish.image}
                    alt=""
                    width={170}
                    height={140}
                  />
                  <div style={{ flex: 1 }}>
                    <strong>{dish.name}</strong>
                    <div className="muted">
                      ${Number(dish.price)} · {dish.category.name}
                    </div>
                  </div>
                  <Link className="small-button" href={`/dishes/${dish.slug}`}>
                    View
                  </Link>
                </article>
              ))}
              {!profile.dishes.length && (
                <p className="muted">No dishes yet. Seed data includes demo cook menus to explore.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
