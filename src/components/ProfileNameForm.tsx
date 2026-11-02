"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileNameForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("first_name,last_name").eq("id", user.id).maybeSingle();
        setFirstName(data?.first_name ?? user.user_metadata?.first_name ?? "");
        setLastName(data?.last_name ?? user.user_metadata?.last_name ?? "");
      }
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const { error } = await supabase.from("profiles").update({
      first_name: cleanFirst,
      last_name: cleanLast,
      full_name: `${cleanFirst} ${cleanLast}`,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    setMessage(error ? "We could not save your name. Please try again." : "Your name has been saved.");
    setSaving(false);
  }

  if (loading) return null;

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-widest text-pink">Your details</p>
      <h2 className="mt-2 text-xl font-black uppercase">First and last name</h2>
      <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label><span className="mb-2 block text-sm font-bold text-white/60">First name</span><input required value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" className="progress-input" /></label>
        <label><span className="mb-2 block text-sm font-bold text-white/60">Last name</span><input required value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" className="progress-input" /></label>
        <button disabled={saving} className="rounded-full bg-pink px-6 py-3 font-black disabled:opacity-60">{saving ? "Saving…" : "Save name"}</button>
      </form>
      {message && <p role="status" className="mt-4 text-sm text-pink">{message}</p>}
    </section>
  );
}
