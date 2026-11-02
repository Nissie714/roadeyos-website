"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InstructorLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
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
      {message && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{message}</p>}
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-white/70">Instructor email</span>
        <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-4 outline-none focus:border-pink" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-white/70">Password</span>
        <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-4 outline-none focus:border-pink" />
      </label>
      <button disabled={busy} className="w-full rounded-full bg-pink px-6 py-4 font-black disabled:opacity-60">
        {busy ? "Checking access…" : "Instructor sign in"}
      </button>
    </form>
  );
}
