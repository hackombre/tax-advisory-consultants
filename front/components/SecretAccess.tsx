"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SecretAccess() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const router = useRouter();

  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const remainingSeconds = lockedUntil ? Math.max(0, Math.ceil((lockedUntil - now) / 1000)) : 0;
  const isLocked = lockedUntil !== null && remainingSeconds > 0;

  useEffect(() => {
    if (lockedUntil && remainingSeconds === 0) {
      setLockedUntil(null);
      setError("");
    }
  }, [remainingSeconds, lockedUntil]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        setOpen(false);
        setUsername("");
        setPassword("");
        router.push("/admin");
        return;
      }

      if (data.locked) {
        setLockedUntil(Date.now() + (data.retryAfterSeconds ?? 300) * 1000);
        setNow(Date.now());
        setError(data.message || "Trop de tentatives. Réessayez plus tard.");
        return;
      }

      setError(data.message || "Identifiants incorrects.");
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={() => setOpen(false)}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-navy/[0.06]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0b1b3a" strokeWidth="1.6">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 118 0v4" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="mb-6 text-center text-lg font-semibold text-navy">Connexion</h2>

        <div className="mb-4">
          <label className="mb-1 block text-xs uppercase tracking-wide text-navy/60">
            Identifiant
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            className="w-full rounded-lg border border-navy/20 px-3 py-2 text-navy focus:border-navy focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-xs uppercase tracking-wide text-navy/60">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-navy/20 px-3 py-2 text-navy focus:border-navy focus:outline-none"
          />
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error}
            {isLocked && (
              <>
                {" "}
                <span className="font-semibold">
                  ({Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, "0")})
                </span>
              </>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || isLocked}
          className="w-full rounded-lg bg-navy py-2.5 text-sm font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isLocked ? "Accès bloqué" : loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
