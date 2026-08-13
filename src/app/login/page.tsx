import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main id="main" className="page-shell auth-page">
        <section className="auth-panel">
          <div className="eyebrow">Welcome back</div>
          <h1>Sign in</h1>
          <p className="muted">Use your Plate &amp; Palate account to browse, review, or manage dishes.</p>
          <AuthForm mode="login" action={loginAction} />
          <p className="muted" style={{ marginTop: 18, fontSize: "0.875rem" }}>
            Demo: buyer@plateandpalate.test / buyer1234
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
