import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DishForm } from "@/components/DishForm";
import { getCategories } from "@/lib/data";

export default async function NewDishPage() {
  const categories = await getCategories();

  return (
    <>
      <Header />
      <main className="page-shell auth-page">
        <section className="auth-panel">
          <div className="eyebrow">Cook dashboard</div>
          <h1>Add a dish</h1>
          <p className="muted">List a new dish on your menu.</p>
          <DishForm categories={categories} />
          <Link className="text-link" href="/cook/manage" style={{ display: "inline-block", marginTop: 18 }}>
            Back to your menu
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
