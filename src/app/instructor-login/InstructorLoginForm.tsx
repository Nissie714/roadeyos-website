"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InstructorLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(true);

  async function resetPassword() {
    if (!email.trim()) {
      setIsError(true);
      setMessage("Enter your instructor email first, then select Forgot password.");
      return;
    }

    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setBusy(false);

    if (error) {
      setIsError(true);
      setMessage(error.message.toLowerCase().includes("rate limit")
        ? "Too many reset emails have been requested. Please wait and try again later."
        : "We could not send the reset email. Please check the address and try again.");
      return;
    }

    setIsError(false);
    setMessage("If an account exists for that email address, a password-reset link has been sent.");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setIsError(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("That email address or password was not recognised.");
      setBusy(false);
      return;
    }

    const { data: allowed, error: roleError } = await supabase.rpc("is_instructor");
    if (roleError || !allowed) {
      await supabase.auth.signOut();
      setMessage("This account does not have instructor access.");
      setBusy(false);
      return;
    }

    router.push("/instructor");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-5">
      {message && <p role="status" className={`rounded-xl border p-4 text-sm ${isError ? "border-red-400/30 bg-red-400/10 text-red-200" : "border-pink/30 bg-pink/10 text-pink"}`}>{message}</p>}
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-white/70">Instructor email</span>
        <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-4 outline-none focus:border-pink" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-white/70">Password</span>
        <input required type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-4 outline-none focus:border-pink" />
        <span className="mt-3 flex items-center gap-2 text-sm text-white/60">
          <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} className="h-4 w-4 accent-pink" />
          Show password
        </span>
      </label>
      <button type="button" disabled={busy} onClick={() => void resetPassword()} className="text-sm font-bold text-pink underline-offset-4 hover:underline disabled:opacity-50">
        Forgot password?
      </button>
      <button disabled={busy} className="w-full rounded-full bg-pink px-6 py-4 font-black disabled:opacity-60">
        {busy ? "Checking access…" : "Instructor sign in"}
      </button>
    </form>
  );
}
