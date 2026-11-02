"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type RosterRow = {
  session_id: string;
  class_name: string;
  starts_at: string;
  duration_minutes: number;
  capacity: number;
  booking_id: string | null;
  athlete_name: string | null;
  booked_at: string | null;
};

function dateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit",
  }).format(new Date(value));
}

export default function InstructorRoster() {
  const [rows, setRows] = useState<RosterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error: loadError } = await supabase.rpc("get_instructor_session_roster_v2");
    if (loadError) setError(loadError.message);
    else setRows((data ?? []) as RosterRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const sessions = useMemo(() => {
    const grouped = new Map<string, { session: RosterRow; athletes: RosterRow[] }>();
    for (const row of rows) {
      const entry = grouped.get(row.session_id) ?? { session: row, athletes: [] };
      if (row.booking_id) entry.athletes.push(row);
      grouped.set(row.session_id, entry);
    }
    return [...grouped.values()];
  }, [rows]);

  if (loading) return <p className="mt-10 text-white/55">Loading class rosters…</p>;
  if (error) return <p className="mt-10 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">{error}</p>;

  return (
    <div className="mt-10 grid gap-5">
      {sessions.map(({ session, athletes }) => (
        <section key={session.session_id} className="rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-pink">{dateTime(session.starts_at)}</p>
              <h2 className="mt-2 text-2xl font-black uppercase">{session.class_name}</h2>
            </div>
            <span className="rounded-full border border-pink/30 bg-pink/10 px-4 py-2 text-sm font-black text-pink">{athletes.length}/{session.capacity} booked</span>
          </div>
          {athletes.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-white/35"><tr><th className="pb-3">Athlete</th><th className="pb-3">Booked</th></tr></thead>
                <tbody className="divide-y divide-white/10">
                  {athletes.map((athlete) => (
                    <tr key={athlete.booking_id}><td className="py-3 font-bold">{athlete.athlete_name}</td><td className="py-3 text-white/45">{athlete.booked_at ? new Date(athlete.booked_at).toLocaleDateString("en-GB") : ""}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="mt-6 text-sm text-white/45">No athletes are booked into this session yet.</p>}
        </section>
      ))}
    </div>
  );
}
