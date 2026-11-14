"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Session = {
  id: string;
  class_name: string;
  starts_at: string;
  duration_minutes: number;
  capacity: number;
  booked_count: number;
  booked_by_me: boolean;
};

type Attendee = {
  session_id: string;
  display_name: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ClassBookingManager({ view }: { view: "upcoming" | "calendar" }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [calendarSessions, setCalendarSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [healthStatus, setHealthStatus] = useState<"self_declared_fit" | "advice_required" | null>(null);

  const loadSessions = useCallback(async () => {
    const supabase = createClient();
    const [{ data, error }, attendeeResult, healthResult] = await Promise.all([
      supabase.rpc("get_upcoming_sessions"),
      supabase.rpc("get_my_class_attendees"),
      supabase.rpc("get_my_health_declaration"),
    ]);

    if (error) {
      setIsError(true);
      setMessage("Class bookings are temporarily unavailable. Please contact Road-e-yo's if you need help booking.");
      setSessions([]);
      setCalendarSessions([]);
    } else {
      const loadedSessions = (data ?? []) as Session[];
      const bookingWindowEnds = new Date();
      bookingWindowEnds.setDate(bookingWindowEnds.getDate() + 14);
      setSessions(loadedSessions);
      setCalendarSessions(loadedSessions.filter((session) => new Date(session.starts_at) <= bookingWindowEnds));
    }
    setAttendees(attendeeResult.error ? [] : ((attendeeResult.data ?? []) as Attendee[]));
    setHealthStatus(healthResult.error ? null : (healthResult.data?.[0]?.declaration_status ?? null));
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadSessions(), 0);
    return () => window.clearTimeout(timer);
  }, [loadSessions]);

  const myBookings = useMemo(
    () => sessions.filter((session) => session.booked_by_me),
    [sessions],
  );

  async function book(session: Session) {
    if (healthStatus !== "self_declared_fit") {
      setIsError(true);
      setMessage(healthStatus === "advice_required" ? "Class booking is locked because your PAR-Q identified a health matter and medical approval to train has not been confirmed. Please contact Yolanda to discuss suitable exercise options." : "Please complete and sign the PAR-Q health declaration in Your details before booking a class.");
      return;
    }
    setWorkingId(session.id);
    setMessage("");
    setIsError(false);
    const supabase = createClient();
    const { error } = await supabase.rpc("book_class", { p_session_id: session.id });

    if (error) {
      setIsError(true);
      setMessage(error.message.includes("full") ? "Sorry, that class has just become full." : error.message);
    } else {
      setMessage(`You are booked into ${session.class_name} on ${formatDate(session.starts_at)} at ${formatTime(session.starts_at)}.`);
      await loadSessions();
    }
    setWorkingId(null);
  }

  async function cancel(session: Session) {
    if (!window.confirm(`Cancel your ${session.class_name} booking on ${formatDate(session.starts_at)}?`)) return;

    setWorkingId(session.id);
    setMessage("");
    setIsError(false);
    const supabase = createClient();
    const { error } = await supabase.rpc("cancel_class", { p_session_id: session.id });

    if (error) {
      setIsError(true);
      setMessage(error.message);
    } else {
      setMessage("Your booking has been cancelled.");
      await loadSessions();
    }
    setWorkingId(null);
  }

  return (
    <>
      {view === "upcoming" && <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black uppercase">Upcoming bookings</h2>
          <span className="text-sm font-bold text-pink">{myBookings.length} booked</span>
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-white/45">Loading your upcoming bookings…</p>
        ) : myBookings.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {myBookings.map((session) => (
              <div key={session.id} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
                <p className="font-black">{session.class_name}</p>
                <p className="mt-1 text-sm text-white/50">{formatDate(session.starts_at)} · {formatTime(session.starts_at)}</p>
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="text-xs font-black uppercase tracking-wider text-pink">Who&apos;s joining you</p>
                  {attendees.some((attendee) => attendee.session_id === session.id) ? (
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {attendees.filter((attendee) => attendee.session_id === session.id).map((attendee) => attendee.display_name).join(", ")}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-white/40">No athletes have chosen to share their name yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-white/45">You do not currently have any upcoming classes booked.</p>
        )}
      </section>

      }

      {view === "calendar" && <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-pink">Live class calendar</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">Book your training</h2>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Choose an available class from the next two weeks. Every session is limited to 25 athletes.
          </p>
        </div>
        <span className="w-fit rounded-full border border-emerald-400/35 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300">
          LIVE BOOKINGS
        </span>
      </div>

      {message && (
        <p role="status" aria-live="polite" className={`mt-6 rounded-xl border px-4 py-3 text-sm font-bold ${isError ? "border-red-400/30 bg-red-400/10 text-red-200" : "border-pink/25 bg-pink/10 text-pink"}`}>
          {message}
        </p>
      )}

      {!loading && healthStatus !== "self_declared_fit" && (
        <div className="mt-6 rounded-2xl border border-amber-300/35 bg-amber-300/10 p-5">
          <p className="font-black text-amber-100">PAR-Q required before booking</p>
          <p className="mt-2 text-sm leading-6 text-white/60">
            {healthStatus === "advice_required"
              ? "Your PAR-Q identified a health matter and medical approval to train has not been confirmed, so class booking is locked. Open Your details to update the PAR-Q after receiving approval, or contact Yolanda to discuss suitable exercise options."
              : "Open the Your details tab and complete every PAR-Q question, tick the declaration and digitally sign it before booking your first class."}
          </p>
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-white/50">Loading available classes…</p>
      ) : calendarSessions.length === 0 && !isError ? (
        <p className="mt-8 rounded-xl border border-white/10 bg-black/25 p-5 text-sm text-white/50">
          There are no upcoming classes available to book yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-3">
          {calendarSessions.map((session) => {
            const spaces = Math.max(0, session.capacity - session.booked_count);
            const busy = workingId === session.id;
            return (
              <article key={session.id} className={`rounded-2xl border p-4 ${session.booked_by_me ? "border-pink/50 bg-pink/[.08]" : "border-white/10 bg-white/[.025]"}`}>
                <div className="grid items-center gap-4 sm:grid-cols-[8rem_1fr_auto]">
                  <div>
                    <p className="text-sm font-black text-pink">{formatDate(session.starts_at)}</p>
                    <p className="mt-1 text-xs text-white/45">{formatTime(session.starts_at)}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-black">{session.class_name}</h3>
                      {session.booked_by_me && <span className="rounded-full bg-pink px-3 py-1 text-[.65rem] font-black uppercase tracking-wider">Booked</span>}
                    </div>
                    <p className="mt-1 text-sm text-white/50">{session.duration_minutes} minutes · {spaces} spaces remaining</p>
                  </div>
                  {session.booked_by_me ? (
                    <button disabled={busy} onClick={() => void cancel(session)} className="rounded-full border border-pink/60 px-5 py-2 text-xs font-black text-pink transition hover:bg-pink hover:text-white disabled:opacity-50">
                      {busy ? "Cancelling…" : "Cancel booking"}
                    </button>
                  ) : (
                    <button disabled={busy || spaces === 0 || healthStatus !== "self_declared_fit"} onClick={() => void book(session)} className="rounded-full bg-pink px-5 py-2 text-xs font-black transition enabled:hover:bg-[#ff3b91] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35">
                      {busy ? "Booking…" : spaces === 0 ? "Class full" : healthStatus !== "self_declared_fit" ? "PAR-Q required" : "Book class"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-5 text-xs leading-5 text-white/35">
        Group sessions must be cancelled at least 6 hours before the class begins.
      </p>
      </section>
      }
    </>
  );
}
