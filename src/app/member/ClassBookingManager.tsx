"use client";

import { useMemo, useState } from "react";

type Session = {
  id: string;
  day: string;
  date: string;
  time: string;
  name: string;
  bookedCount: number;
  attendees: string[];
};

const classCapacity = 25;

const sessions: Session[] = [
  { id: "mon-1800", day: "Mon", date: "27", time: "6:00 pm", name: "Bootcamp", bookedCount: 17, attendees: ["Sam R.", "Jess T."] },
  { id: "tue-0930", day: "Tue", date: "28", time: "9:30 am", name: "Bootcamp", bookedCount: 13, attendees: ["Alex P."] },
  { id: "tue-1915", day: "Tue", date: "28", time: "7:15 pm", name: "HYROX", bookedCount: 21, attendees: ["Jamie C.", "Taylor B."] },
  { id: "wed-1800", day: "Wed", date: "29", time: "6:00 pm", name: "Bootcamp", bookedCount: 18, attendees: ["Morgan L."] },
  { id: "thu-0930", day: "Thu", date: "30", time: "9:30 am", name: "Bootcamp", bookedCount: 15, attendees: [] },
  { id: "fri-0930", day: "Fri", date: "31", time: "9:30 am", name: "HYROX", bookedCount: 22, attendees: ["Chris D."] },
  { id: "fri-1800", day: "Fri", date: "31", time: "6:00 pm", name: "HYROX", bookedCount: 19, attendees: ["Jordan W.", "Casey H."] },
  { id: "sat-0900", day: "Sat", date: "01", time: "9:00 am", name: "Bootcamp", bookedCount: 16, attendees: ["Robin S."] },
];

export default function ClassBookingManager() {
  const [bookedIds, setBookedIds] = useState<string[]>(["mon-1800"]);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [replacementId, setReplacementId] = useState("");
  const [showMyName, setShowMyName] = useState(false);
  const [message, setMessage] = useState(
    "You have 1 class booked this week.",
  );

  const bookedSessions = useMemo(
    () => sessions.filter((session) => bookedIds.includes(session.id)),
    [bookedIds],
  );

  function book(session: Session) {
    setBookedIds((current) => [...current, session.id]);
    setMessage(`${session.name} on ${session.day} at ${session.time} is booked in this preview.`);
  }

  function cancel(session: Session) {
    setBookedIds((current) => current.filter((id) => id !== session.id));
    setReschedulingId(null);
    setReplacementId("");
    setMessage(`${session.name} on ${session.day} at ${session.time} has been cancelled in this preview.`);
  }

  function confirmReschedule(original: Session) {
    const replacement = sessions.find((session) => session.id === replacementId);
    if (!replacement) {
      setMessage("Choose a replacement class first.");
      return;
    }

    setBookedIds((current) => [
      ...current.filter((id) => id !== original.id),
      replacement.id,
    ]);
    setReschedulingId(null);
    setReplacementId("");
    setMessage(
      `Booking moved from ${original.day} at ${original.time} to ${replacement.day} at ${replacement.time}.`,
    );
  }

  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-pink">
            Class calendar
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
            Book your training
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/50">
            27 July-1 August · choose a class or manage an existing booking.
          </p>
        </div>
        <span className="w-fit rounded-full border border-pink/35 bg-pink/10 px-4 py-2 text-xs font-black text-pink">
          INTERACTIVE PREVIEW
        </span>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-6 rounded-xl border border-pink/25 bg-pink/10 px-4 py-3 text-sm font-bold text-pink"
      >
        {message}
      </p>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="text-sm font-black">Show my name on class lists</p>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-white/45">
            If switched on, logged-in athletes can see your first name and
            surname initial on sessions you have booked. It is off by default
            and you can withdraw permission at any time.
          </p>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-3 sm:mt-0">
          <input
            type="checkbox"
            checked={showMyName}
            onChange={(event) => {
              const enabled = event.target.checked;
              setShowMyName(enabled);
              setMessage(
                enabled
                  ? "Your name will appear to logged-in athletes on your booked sessions."
                  : "Your name is now hidden from other athletes.",
              );
            }}
            className="peer sr-only"
          />
          <span className="relative h-7 w-12 rounded-full bg-white/15 transition peer-checked:bg-pink after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
          <span className="min-w-8 text-sm font-black text-white/60">
            {showMyName ? "On" : "Off"}
          </span>
        </label>
      </div>

      <div className="mt-6 grid gap-3">
        {sessions.map((session) => {
          const booked = bookedIds.includes(session.id);
          const availableSpaces = Math.max(
            0,
            classCapacity - session.bookedCount - (booked ? 1 : 0),
          );
          const rescheduling = reschedulingId === session.id;
          const visibleAttendees = [
            ...session.attendees,
            ...(booked && showMyName ? ["You"] : []),
          ];

          return (
            <article
              key={session.id}
              className={`rounded-2xl border p-4 ${
                booked
                  ? "border-pink/50 bg-pink/[.08]"
                  : "border-white/10 bg-white/[.025]"
              }`}
            >
              <div className="grid items-center gap-4 sm:grid-cols-[4.5rem_1fr_auto]">
                <div className="flex items-center gap-3 sm:block sm:text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-white/45">
                    {session.day}
                  </p>
                  <p className="text-2xl font-black text-pink">{session.date}</p>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-black">{session.name}</h3>
                    {booked && (
                      <span className="rounded-full bg-pink px-3 py-1 text-[.65rem] font-black uppercase tracking-wider">
                        Booked
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-white/50">
                    {session.time} · 60 minutes
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <span className="mr-2 text-xs font-bold text-emerald-400">
                    {availableSpaces} of {classCapacity} spaces remaining
                  </span>
                  {booked ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setReschedulingId(rescheduling ? null : session.id);
                          setReplacementId("");
                        }}
                        className="rounded-full border border-white/25 px-4 py-2 text-xs font-black transition hover:border-white/60"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={() => cancel(session)}
                        className="rounded-full border border-pink/60 px-4 py-2 text-xs font-black text-pink transition hover:bg-pink hover:text-white"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={availableSpaces === 0}
                      onClick={() => book(session)}
                      className="rounded-full bg-pink px-5 py-2 text-xs font-black transition enabled:hover:bg-[#ff3b91] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
                    >
                      {availableSpaces === 0 ? "Full" : "Book"}
                    </button>
                  )}
                </div>
              </div>

              {visibleAttendees.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                  <span className="mr-1 text-xs font-black uppercase tracking-widest text-white/35">
                    Going
                  </span>
                  {visibleAttendees.map((attendee) => (
                    <span
                      key={attendee}
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        attendee === "You"
                          ? "border-pink bg-pink/10 text-pink"
                          : "border-white/10 bg-white/[.04] text-white/55"
                      }`}
                    >
                      {attendee}
                    </span>
                  ))}
                </div>
              )}

              {rescheduling && (
                <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-[1fr_auto]">
                  <label>
                    <span className="sr-only">Choose a replacement class</span>
                    <select
                      value={replacementId}
                      onChange={(event) => setReplacementId(event.target.value)}
                      className="progress-input"
                    >
                      <option value="">Choose another session</option>
                      {sessions
                        .filter(
                          (option) =>
                            option.id !== session.id &&
                            !bookedIds.includes(option.id),
                        )
                        .map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.day} {option.date} · {option.time} · {option.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => confirmReschedule(session)}
                    className="rounded-full bg-white px-5 py-3 text-sm font-black text-black"
                  >
                    Confirm move
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-black uppercase">My bookings</h3>
          <span className="text-sm font-bold text-pink">
            {bookedSessions.length} booked
          </span>
        </div>
        {bookedSessions.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {bookedSessions.map((session) => (
              <div key={session.id} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
                <p className="font-black">{session.name}</p>
                <p className="mt-1 text-sm text-white/50">
                  {session.day} {session.date} · {session.time}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-white/45">
            You do not currently have any classes booked this week.
          </p>
        )}
      </div>

      <p className="mt-5 text-xs leading-5 text-white/35">
        Preview actions last only until the page is refreshed. Confirmation
        emails, waiting lists, privacy preferences and real class capacities
        will be connected later. Names shown above are fictional examples.
      </p>
    </section>
  );
}
