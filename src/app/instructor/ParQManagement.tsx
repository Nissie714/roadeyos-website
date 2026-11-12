"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AthleteParQ = {
  user_id: string;
  athlete_name: string;
  athlete_email: string;
  declaration_status: "self_declared_fit" | "advice_required" | null;
  signed_at: string | null;
  last_reset_at: string | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ParQManagement() {
  const [athletes, setAthletes] = useState<AthleteParQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState("");
  const [message, setMessage] = useState("");

  const loadAthletes = useCallback(async () => {
    const { data, error } = await createClient().rpc("get_instructor_parq_statuses");
    if (error) setMessage(error.message);
    else setAthletes((data ?? []) as AthleteParQ[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadAthletes(), 0);
    return () => window.clearTimeout(timer);
  }, [loadAthletes]);

  async function resetParQ(athlete: AthleteParQ) {
    const confirmed = window.confirm(
      `Reset ${athlete.athlete_name}'s PAR-Q?\n\nThis confirms that the declaration has been discussed with an instructor and was completed incorrectly. The athlete will be unable to book another class until they submit a new PAR-Q.`,
    );
    if (!confirmed) return;

    setResetting(athlete.user_id);
    setMessage("");
    const { error } = await createClient().rpc("reset_member_parq", {
      p_user_id: athlete.user_id,
    });
    if (error) setMessage(error.message);
    else {
      setMessage(`${athlete.athlete_name}'s PAR-Q has been reset. They must complete a new declaration before booking.`);
      await loadAthletes();
    }
    setResetting("");
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <p className="text-xs font-black uppercase tracking-widest text-pink">Instructor-only health screening</p>
      <h2 className="mt-2 text-2xl font-black uppercase">Athlete PAR-Q records</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
        Reset a submitted PAR-Q only after discussing it with the athlete and confirming that it was completed incorrectly. A reset immediately locks new class bookings until the athlete completes and signs a replacement PAR-Q.
      </p>

      {message && <p role="status" className="mt-5 rounded-2xl border border-pink/25 bg-pink/[.07] p-4 text-sm font-bold text-pink">{message}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-white/45">Loading athlete PAR-Q records…</p>
      ) : athletes.length === 0 ? (
        <p className="mt-6 text-sm text-white/45">No registered athletes were found.</p>
      ) : (
        <div className="mt-6 grid gap-3">
          {athletes.map((athlete) => (
            <article key={athlete.user_id} className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[.025] p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-black">{athlete.athlete_name}</p>
                <p className="mt-1 text-xs text-white/40">{athlete.athlete_email}</p>
                {athlete.declaration_status ? (
                  <p className={`mt-2 text-sm font-bold ${athlete.declaration_status === "self_declared_fit" ? "text-emerald-300" : "text-amber-200"}`}>
                    {athlete.declaration_status === "self_declared_fit" ? "Fit-to-participate PAR-Q" : "PAR-Q requires discussion"}
                    {athlete.signed_at ? ` · signed ${formatDate(athlete.signed_at)}` : ""}
                  </p>
                ) : (
                  <p className="mt-2 text-sm font-bold text-white/45">No active PAR-Q — booking locked</p>
                )}
                {athlete.last_reset_at && <p className="mt-1 text-xs text-white/40">Last reset by an instructor: {formatDate(athlete.last_reset_at)}</p>}
              </div>
              <button
                type="button"
                disabled={!athlete.declaration_status || resetting === athlete.user_id}
                onClick={() => void resetParQ(athlete)}
                className="shrink-0 rounded-full border border-pink/60 px-5 py-2.5 text-xs font-black uppercase text-pink transition enabled:hover:bg-pink enabled:hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/25"
              >
                {resetting === athlete.user_id ? "Resetting…" : athlete.declaration_status ? "Reset PAR-Q" : "Awaiting PAR-Q"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
