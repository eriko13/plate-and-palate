import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AvatarForm } from "@/components/AvatarForm";
import { DeleteDishButton } from "@/components/DeleteDishButton";
import { prisma } from "@/lib/prisma";

export default async function ManageDishesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "COOK") redirect("/browse");

  const profile = await prisma.cookProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      dishes: {
    include: {
      category: true,
      requests: {
        include: { buyer: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
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
              Signed in as {session.user.name}. Manage your menu, see buyer requests, and update your profile photo.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <Link className="button button-primary" href="/cook/dishes/new">
                Add dish
              </Link>
              <Link className="button button-light" href={`/cook/${profile.slug}`}>
                View public profile
              </Link>
            </div>
            <div className="avatar-panel">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Your photo</div>
                  <h2>Profile photo</h2>
                </div>
                <Image className="avatar avatar-small" src={profile.avatar} alt="" width={64} height={64} />
              </div>
              <AvatarForm />
            </div>
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
                  <Link className="small-button" href={`/cook/dishes/${dish.id}/edit`}>
                    Edit
                  </Link>
                  <DeleteDishButton dishId={dish.id} dishName={dish.name} />
                </article>
              ))}
              {!profile.dishes.length && (
                <p className="muted">No dishes yet. Seed data includes demo cook menus to explore.</p>
              )}
            </div>
            <div className="requests-dashboard">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Buyer messages</div>
                  <h2>Dish requests</h2>
                </div>
                <span className="muted">{profile.dishes.reduce((count, dish) => count + dish.requests.length, 0)} received</span>
              </div>
              <div className="review-list">
                {profile.dishes.flatMap((dish) =>
                  dish.requests.map((request) => (
                    <article className="review-item" key={request.id}>
                      <div className="review-heading">
                        <strong>{request.buyer.name ?? "Plate & Palate buyer"}</strong>
                        <span className="muted">{dish.name}</span>
                      </div>
                      <p>{request.message}</p>
                      <div className="muted">Reply at {request.buyer.email}</div>
                    </article>
                  )),
                )}
                {!profile.dishes.some((dish) => dish.requests.length) && (
                  <p className="muted">New buyer requests will appear here.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
