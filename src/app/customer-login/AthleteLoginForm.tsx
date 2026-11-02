"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AthleteLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(searchParams.get("message") ?? "");
  const [isError, setIsError] = useState(Boolean(searchParams.get("message")));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setIsError(false);

    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      setBusy(false);
      if (error) {
        setIsError(true);
        setMessage(error.message);
        return;
      }

      if (data.session) {
        router.push("/member");
        router.refresh();
        return;
      }

      setMessage("Check your email and select the confirmation link to activate your athlete account.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      setIsError(true);
      setMessage("That email address or password was not recognised.");
      return;
    }

    router.push("/member");
    router.refresh();
  }

  return (
    <>
      <div className="flex rounded-full border border-white/10 bg-black p-1" aria-label="Choose login or account registration">
        <button
          type="button"
          onClick={() => { setMode("login"); setMessage(""); }}
          className={`flex-1 rounded-full px-4 py-3 text-sm font-black transition ${mode === "login" ? "bg-pink text-white" : "text-white/55 hover:text-white"}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => { setMode("signup"); setMessage(""); }}
          className={`flex-1 rounded-full px-4 py-3 text-sm font-black transition ${mode === "signup" ? "bg-pink text-white" : "text-white/55 hover:text-white"}`}
        >
          Create account
        </button>
      </div>

      <h2 className="mt-8 text-3xl font-black uppercase tracking-tight">
        {mode === "login" ? "Athlete login" : "Join Road-e-yo's"}
      </h2>

      {message && (
        <div className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${isError ? "border-red-400/30 bg-red-400/10 text-red-200" : "border-pink/30 bg-pink/10 text-pink"}`} role="status">
          {message}
        </div>
      )}

      <form className="mt-7 space-y-5" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-white/70">Email address</span>
          <input
            required
            autoComplete="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-pink"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-white/70">Password</span>
          <input
            required
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-pink"
          />
        </label>
        <button
          disabled={busy}
          className="w-full rounded-full bg-pink px-6 py-4 font-black text-white transition hover:bg-[#ff4d9a] disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "login" ? "Sign in securely" : "Create athlete account"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs leading-5 text-white/35">
        Your password is handled securely by Supabase and is never visible to Road-e-yo&apos;s staff.
      </p>
    </>
  );
}
