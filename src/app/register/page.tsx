import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main id="main" className="page-shell auth-page">
        <section className="auth-panel">
          <div className="eyebrow">Join the neighborhood table</div>
          <h1>Create your account</h1>
          <p className="muted">Register as a buyer or a cook. Cooks get a seller profile to list dishes.</p>
          <AuthForm mode="register" action={registerAction} />
        </section>
      </main>
      <Footer />
    </>
  );
}
