"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EmergencyContact = { contact_name: string; relationship: string; telephone: string };

export default function EmergencyContactForm() {
  const [contact, setContact] = useState<EmergencyContact>({ contact_name: "", relationship: "", telephone: "" });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const { data, error } = await createClient().rpc("get_my_emergency_contact");
      if (!error && data?.[0]) {
        const saved = data[0] as EmergencyContact & { consent_to_instructor_access: boolean };
        setContact({ contact_name: saved.contact_name, relationship: saved.relationship, telephone: saved.telephone });
        setConsent(saved.consent_to_instructor_access);
      }
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) { setMessage("Please confirm that instructors may access this information in an emergency."); return; }
    setSaving(true); setMessage("");
    const { error } = await createClient().rpc("save_my_emergency_contact", { p_contact_name: contact.contact_name.trim(), p_relationship: contact.relationship.trim(), p_telephone: contact.telephone.trim(), p_consent: consent });
    setMessage(error ? "We could not save your emergency contact. Please try again." : "Emergency contact saved securely.");
    setSaving(false);
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-6">
      <p className="text-xs font-black uppercase tracking-widest text-pink">Safety information</p>
      <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">Emergency contact</h2>
      <p className="mt-3 text-sm leading-6 text-white/50">Add someone Road-e-yo&apos;s can contact if there is an emergency during your visit.</p>
      {loading ? <p className="mt-6 text-sm text-white/45">Loading your emergency contact…</p> : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block"><span className="mb-2 block text-sm font-bold text-white/65">Contact&apos;s full name</span><input required value={contact.contact_name} onChange={(e) => setContact({ ...contact, contact_name: e.target.value })} type="text" autoComplete="name" className="progress-input" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-white/65">Relationship to you</span><input required value={contact.relationship} onChange={(e) => setContact({ ...contact, relationship: e.target.value })} type="text" className="progress-input" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-white/65">Contact telephone number</span><input required value={contact.telephone} onChange={(e) => setContact({ ...contact, telephone: e.target.value })} type="tel" autoComplete="tel" className="progress-input" /></label>
          <label className="flex items-start gap-3 rounded-2xl border border-pink/25 bg-pink/[.06] p-4 text-sm leading-6 text-white/65"><input required checked={consent} onChange={(e) => setConsent(e.target.checked)} type="checkbox" className="mt-1 h-4 w-4 accent-pink" /><span>I understand and agree that these details will be stored securely and shared with Road-e-yo&apos;s instructors if they are needed in an emergency.</span></label>
          <button disabled={saving} type="submit" className="w-full rounded-full bg-pink px-5 py-3 text-sm font-black transition hover:bg-[#ff3b91] disabled:opacity-50">{saving ? "Saving…" : "Save emergency contact"}</button>
        </form>
      )}
      {message && <p role="status" className="mt-4 text-sm font-bold text-pink">{message}</p>}
    </section>
  );
}
