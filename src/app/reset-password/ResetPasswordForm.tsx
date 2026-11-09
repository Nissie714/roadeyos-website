"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PasswordVisibilityButton from "@/components/PasswordVisibilityButton";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("The passwords do not match.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setIsError(true);
      setMessage("This reset link may have expired. Please request a new one from the login screen.");
      setBusy(false);
      return;
    }

    await supabase.auth.signOut();
    setComplete(true);
    setMessage("Your password has been updated. You can now sign in.");
    setBusy(false);
  }

  return (
    <>
      {message && <p role="status" className={`rounded-xl border p-4 text-sm ${isError ? "border-red-400/30 bg-red-400/10 text-red-200" : "border-pink/30 bg-pink/10 text-pink"}`}>{message}</p>}
      {complete ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/customer-login" className="rounded-full bg-pink px-6 py-4 text-center font-black">Athlete login</Link>
          <Link href="/instructor-login" className="rounded-full border border-white/20 px-6 py-4 text-center font-black hover:border-pink">Instructor login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-white/70">New password</span>
            <div className="relative">
              <input required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[.04] py-4 pl-4 pr-14 outline-none focus:border-pink" />
              <PasswordVisibilityButton visible={showPassword} onToggle={() => setShowPassword((current) => !current)} />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-white/70">Confirm new password</span>
            <div className="relative">
              <input required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[.04] py-4 pl-4 pr-14 outline-none focus:border-pink" />
              <PasswordVisibilityButton visible={showPassword} onToggle={() => setShowPassword((current) => !current)} />
            </div>
          </label>
          <button disabled={busy} className="w-full rounded-full bg-pink px-6 py-4 font-black disabled:opacity-60">
            {busy ? "Updating password…" : "Save new password"}
          </button>
        </form>
      )}
    </>
  );
}
