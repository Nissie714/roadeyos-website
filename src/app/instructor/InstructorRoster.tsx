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
  const [message, setMessage] = useState("");
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStartsAt, setNewStartsAt] = useState("");

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

  function localInputValue(value: string) {
    const date = new Date(value);
    const local = new Date(date.getTime() - (date.getTimezoneOffset() * 60_000));
    return local.toISOString().slice(0, 16);
  }

  function beginEditing(session: RosterRow) {
    setEditingId(session.session_id);
    setNewStartsAt(localInputValue(session.starts_at));
    setMessage("");
  }

  async function saveTime(session: RosterRow) {
    if (!newStartsAt) return;
    setWorkingId(session.session_id);
    setMessage("");
    const supabase = createClient();
    const { error: updateError } = await supabase.rpc("instructor_update_class_time", {
      p_session_id: session.session_id,
      p_starts_at: new Date(newStartsAt).toISOString(),
    });
    if (updateError) setMessage(updateError.message);
    else {
      setMessage("Class time updated. Booked athletes have received a class update.");
      setEditingId(null);
      await load();
    }
    setWorkingId(null);
  }

  async function cancelClass(session: RosterRow) {
    if (!window.confirm(`Cancel ${session.class_name} on ${dateTime(session.starts_at)}? Booked athletes will be notified.`)) return;
    setWorkingId(session.session_id);
    setMessage("");
    const supabase = createClient();
    const { error: cancelError } = await supabase.rpc("instructor_cancel_class", { p_session_id: session.session_id });
    if (cancelError) setMessage(cancelError.message);
    else {
      setMessage("Class cancelled. Booked athletes have received a class update.");
      await load();
    }
    setWorkingId(null);
  }

  if (loading) return <p className="mt-10 text-white/55">Loading class rosters…</p>;
  if (error) return <p className="mt-10 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">{error}</p>;

  return (
    <div className="mt-10 grid gap-5">
      {message && <p role="status" className="rounded-xl border border-pink/30 bg-pink/10 p-4 text-sm font-bold text-pink">{message}</p>}
      {sessions.map(({ session, athletes }) => (
        <section key={session.session_id} className="rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-pink">{dateTime(session.starts_at)}</p>
              <h2 className="mt-2 text-2xl font-black uppercase">{session.class_name}</h2>
            </div>
            <span className="rounded-full border border-pink/30 bg-pink/10 px-4 py-2 text-sm font-black text-pink">{athletes.length}/{session.capacity} booked</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => beginEditing(session)} className="rounded-full border border-white/20 px-4 py-2 text-xs font-black transition hover:border-pink hover:text-pink">Change date or time</button>
            <button type="button" disabled={workingId === session.session_id} onClick={() => void cancelClass(session)} className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-black text-red-300 transition hover:bg-red-400/10 disabled:opacity-50">Cancel session</button>
          </div>
          {editingId === session.session_id && (
            <div className="mt-4 rounded-2xl border border-pink/25 bg-pink/[.06] p-4">
              <label className="block max-w-sm">
                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-pink">New date and time</span>
                <input type="datetime-local" value={newStartsAt} onChange={(event) => setNewStartsAt(event.target.value)} className="progress-input" />
              </label>
              <div className="mt-3 flex gap-3">
                <button type="button" disabled={workingId === session.session_id} onClick={() => void saveTime(session)} className="rounded-full bg-pink px-5 py-2 text-xs font-black disabled:opacity-50">Save change</button>
                <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-white/15 px-5 py-2 text-xs font-black">Keep original</button>
              </div>
            </div>
          )}
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
