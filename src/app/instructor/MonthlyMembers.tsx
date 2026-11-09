"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type RegisteredMember = {
  user_id: string;
  member_name: string;
  email: string;
  membership_started_on: string | null;
  renewal_due_on: string | null;
};

export default function MonthlyMembers() {
  const [members, setMembers] = useState<RegisteredMember[]>([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const loadMembers = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_registered_members_for_membership");
    if (error) setStatus(error.message);
    else setMembers((data ?? []) as RegisteredMember[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMembers(), 0);
    return () => window.clearTimeout(timer);
  }, [loadMembers]);

  async function saveMembership(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMember || !startDate) {
      setStatus("Choose a registered member and enter their membership start date.");
      return;
    }

    setSaving(true);
    setStatus("");
    const supabase = createClient();
    const { data, error } = await supabase.rpc("set_monthly_membership", {
      p_user_id: selectedMember,
      p_started_on: startDate,
    });

    if (error) setStatus(error.message);
    else {
      const dueDate = new Date(`${String(data)}T12:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setStatus(`Monthly membership saved. Renewal is due ${dueDate}.`);
      await loadMembers();
    }
    setSaving(false);
  }

  const monthlyMembers = members.filter((member) => member.renewal_due_on);

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-7">
      <p className="text-xs font-black uppercase tracking-widest text-pink">Membership management</p>
      <h2 className="mt-2 text-2xl font-black uppercase">Monthly members</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
        Choose a registered athlete and enter the date their monthly membership starts. Their renewal date will be one month later.
      </p>

      <form onSubmit={saveMembership} className="mt-6 grid gap-4 lg:grid-cols-[1fr_14rem_auto] lg:items-end">
        <label>
          <span className="mb-2 block text-sm font-bold text-white/60">Registered member</span>
          <select
            required
            value={selectedMember}
            onChange={(event) => setSelectedMember(event.target.value)}
            disabled={loading}
            className="progress-input"
          >
            <option value="">{loading ? "Loading members…" : "Choose a member"}</option>
            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.member_name} — {member.email}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-white/60">Membership start date</span>
          <input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="progress-input" />
        </label>
        <button disabled={saving || loading} className="rounded-full bg-pink px-6 py-3 font-black disabled:opacity-50">
          {saving ? "Saving…" : "Save membership"}
        </button>
      </form>
      {status && <p role="status" className="mt-4 text-sm font-bold text-pink">{status}</p>}

      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="text-lg font-black uppercase">Current monthly members</h3>
        {monthlyMembers.length ? (
          <div className="mt-4 grid gap-3">
            {monthlyMembers.map((member) => (
              <div key={member.user_id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.025] p-4">
                <div>
                  <p className="font-black">{member.member_name}</p>
                  <p className="mt-1 text-xs text-white/45">{member.email}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-black uppercase tracking-wider text-pink">Renewal due</p>
                  <p className="mt-1 text-sm font-bold">
                    {new Date(`${member.renewal_due_on}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-white/45">No monthly memberships have been set yet.</p>
        )}
      </div>
    </section>
  );
}
