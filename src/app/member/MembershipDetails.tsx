"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Membership = {
  membership_started_on: string;
  renewal_due_on: string;
  status: string;
};

export default function MembershipDetails() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_my_monthly_membership");
      if (error) setMessage("Your membership details are temporarily unavailable.");
      else setMembership((data?.[0] as Membership | undefined) ?? null);
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <p className="text-xs font-black uppercase tracking-widest text-pink">Your account</p>
      <h2 className="mt-2 text-2xl font-black uppercase">Membership</h2>
      {loading ? (
        <p className="mt-6 text-sm text-white/45">Loading membership details…</p>
      ) : message ? (
        <p role="status" className="mt-6 text-sm text-red-200">{message}</p>
      ) : membership ? (
        <div className="mt-6 rounded-2xl border border-pink/30 bg-pink/[.07] p-5">
          <p className="text-xs font-black uppercase tracking-wider text-pink">Monthly membership renewal due</p>
          <p className="mt-3 text-3xl font-black">
            {new Date(`${membership.renewal_due_on}T12:00:00`).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mt-3 text-sm text-white/50">
            Membership started {new Date(`${membership.membership_started_on}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-white/45">No monthly membership has been assigned to your account.</p>
      )}
    </section>
  );
}
