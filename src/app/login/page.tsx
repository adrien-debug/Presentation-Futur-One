"use client";

import React, { useState, useTransition, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const IS_DEV = process.env.NODE_ENV === "development";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  const [error, setError] = useState("");
  const [pending, start]  = useTransition();

  // Dev mode: auto-login immediately, no email needed
  useEffect(() => {
    if (IS_DEV) {
      router.replace("/api/dev/auto-login");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    start(async () => {
      const res = await signIn("resend", {
        email: email.trim(),
        redirect: false,
        callbackUrl: "/projects",
      });
      if (res?.error) setError("Erreur d'envoi. Vérifiez votre email.");
      else setSent(true);
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--bg-app)", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div
          className="w-10 h-10 flex items-center justify-center text-[13px] font-black"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg-on-accent)" }}
        >
          F1
        </div>
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--fg-primary)" }}>
            FUTUR ONE
          </div>
          <div className="text-[9px] font-mono mt-0.5" style={{ color: "var(--fg-muted)", letterSpacing: "0.1em" }}>
            DataCenter · Design Tool
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm px-8 py-10 flex flex-col gap-6"
        style={{ border: "1px solid var(--border-strong)", backgroundColor: "var(--bg-elevated)" }}
      >
        {!sent ? (
          <>
            <div>
              <h1 className="text-[20px] font-bold mb-1" style={{ color: "var(--fg-primary)" }}>
                Connexion
              </h1>
              <p className="text-[11px]" style={{ color: "var(--fg-secondary)" }}>
                Entrez votre email — un lien de connexion vous sera envoyé.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[9px] font-mono uppercase"
                  style={{ color: "var(--fg-secondary)", letterSpacing: "0.14em" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="px-3 py-2.5 text-[12px] font-mono outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--fg-primary)",
                    caretColor: "var(--accent)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border-strong)")}
                />
              </div>

              {error && (
                <p className="text-[10px]" style={{ color: "var(--danger)" }} role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={pending || !email.trim()}
                className="py-2.5 text-[10px] font-mono uppercase font-bold tracking-widest transition-all disabled:opacity-40"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--bg-on-accent)",
                  letterSpacing: "0.18em",
                }}
              >
                {pending ? "Envoi en cours…" : "Envoyer le lien"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col gap-4 items-center text-center py-4">
            <div
              className="w-12 h-12 flex items-center justify-center text-[20px]"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                color: "var(--accent)",
              }}
            >
              ✓
            </div>
            <div>
              <p className="text-[13px] font-bold mb-1" style={{ color: "var(--fg-primary)" }}>
                Lien envoyé
              </p>
              <p className="text-[11px]" style={{ color: "var(--fg-secondary)" }}>
                Vérifiez votre boite mail ({email}) et cliquez sur le lien pour accéder à votre espace.
              </p>
            </div>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="text-[9px] font-mono uppercase mt-2"
              style={{ color: "var(--fg-secondary)", letterSpacing: "0.1em" }}
            >
              Changer d&apos;email
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-[8px] font-mono" style={{ color: "var(--fg-deep)", letterSpacing: "0.1em" }}>
        FUTUR ONE © 2025 · DataCenter Infrastructure · Qatar
      </p>
    </div>
  );
}
