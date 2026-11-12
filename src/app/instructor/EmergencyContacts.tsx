"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Contact = { athlete_name: string; athlete_email: string; contact_name: string; relationship: string; telephone: string };

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const { data, error: requestError } = await createClient().rpc("get_instructor_emergency_contacts");
      if (requestError) setError("Emergency contacts are temporarily unavailable."); else setContacts((data as Contact[] | null) ?? []);
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <p className="text-xs font-black uppercase tracking-widest text-pink">Instructor-only safety information</p>
      <h2 className="mt-2 text-2xl font-black uppercase">Emergency contacts</h2>
      <p className="mt-3 text-sm leading-6 text-white/50">Use these details only when needed for an athlete&apos;s health or safety in an emergency.</p>
      {loading ? <p className="mt-6 text-sm text-white/45">Loading emergency contacts…</p> : error ? <p className="mt-6 text-sm text-red-200">{error}</p> : contacts.length === 0 ? <p className="mt-6 text-sm text-white/45">No athletes have saved emergency-contact details yet.</p> : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">{contacts.map((contact) => (
          <article key={`${contact.athlete_email}-${contact.telephone}`} className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <p className="text-lg font-black">{contact.athlete_name}</p><p className="mt-1 text-xs text-white/40">{contact.athlete_email}</p>
            <dl className="mt-4 space-y-2 text-sm"><div><dt className="text-white/40">Emergency contact</dt><dd className="font-bold">{contact.contact_name}</dd></div><div><dt className="text-white/40">Relationship</dt><dd>{contact.relationship}</dd></div><div><dt className="text-white/40">Telephone</dt><dd><a className="font-bold text-pink hover:underline" href={`tel:${contact.telephone}`}>{contact.telephone}</a></dd></div></dl>
          </article>
        ))}</div>
      )}
    </section>
  );
}
