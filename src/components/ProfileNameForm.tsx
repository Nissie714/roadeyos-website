"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileNameForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showName, setShowName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [sharingSaving, setSharingSaving] = useState(false);
  const [sharingMessage, setSharingMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("first_name,last_name,show_name_to_athletes").eq("id", user.id).maybeSingle();
        setFirstName(data?.first_name ?? user.user_metadata?.first_name ?? "");
        setLastName(data?.last_name ?? user.user_metadata?.last_name ?? "");
        setShowName(data?.show_name_to_athletes ?? false);
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

  async function updateNameSharing(checked: boolean) {
    const previousValue = showName;
    setShowName(checked);
    setSharingSaving(true);
    setSharingMessage("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowName(previousValue);
      setSharingSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ show_name_to_athletes: checked, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      setShowName(previousValue);
      setSharingMessage("We could not update your choice. Please try again.");
    } else {
      setSharingMessage(checked ? "Permission saved. Your name may now appear to athletes booked into the same class." : "Permission withdrawn. Your name is now hidden from other athletes.");
    }
    setSharingSaving(false);
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
      <div className="mt-6 rounded-2xl border border-pink/25 bg-pink/[.06] p-4 sm:p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={showName}
            disabled={sharingSaving}
            onChange={(event) => void updateNameSharing(event.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-pink disabled:opacity-50"
          />
          <span>
            <span className="block font-black">Display my name to other booked athletes</span>
            <span className="mt-1 block text-sm leading-6 text-white/55">
              I am happy for my first name and surname initial to be shown to other athletes booked into the same session. I can untick this box and withdraw permission at any time.
            </span>
          </span>
        </label>
        {sharingSaving && <p className="mt-3 text-xs font-bold text-white/45">Saving your choice…</p>}
        {sharingMessage && <p role="status" className="mt-3 text-xs font-bold text-pink">{sharingMessage}</p>}
      </div>
    </section>
  );
}
