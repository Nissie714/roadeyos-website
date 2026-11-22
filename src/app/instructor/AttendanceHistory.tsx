"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type AttendanceMonth = {
  month_start: string;
  total_attendances: number;
  unique_athletes: number;
  bootcamp_attendances: number;
  hyrox_attendances: number;
};

export default function AttendanceHistory({ previewData }: { previewData?: AttendanceMonth[] }) {
  const [months, setMonths] = useState<AttendanceMonth[]>(previewData ?? []);
  const [message, setMessage] = useState(previewData ? "" : "Loading attendance history…");

  const loadHistory = useCallback(async () => {
    if (previewData) return;
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_instructor_attendance_history");
    if (error) setMessage(error.message);
    else {
      setMonths((data ?? []) as AttendanceMonth[]);
      setMessage("");
    }
  }, [previewData]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadHistory(), 0);
    return () => window.clearTimeout(timer);
  }, [loadHistory]);

  return (
    <section className="mt-10 rounded-[2rem] border border-pink/25 bg-[#101010] p-5 sm:p-7">
      <p className="eyebrow">Confirmed bookings</p>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-[-.03em]">Monthly attendance history</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">Attendees are taken directly from confirmed class bookings. Each completed month is added from December 2026 onwards; earlier months remain in the history.</p>

      {message ? <p role="status" className="mt-6 text-sm text-white/50">{message}</p> : months.length ? (
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {months.map((month) => (
            <article key={month.month_start} className="rounded-3xl border border-white/10 bg-black/35 p-5">
              <p className="text-xs font-black uppercase tracking-[.2em] text-pink">
                {new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month.month_start}T12:00:00Z`))}
              </p>
              <p className="mt-4 text-5xl font-black tracking-[-.05em]">{month.total_attendances}</p>
              <p className="mt-1 text-sm text-white/45">confirmed class places</p>
              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-sm">
                <div><dt className="text-white/40">Athletes</dt><dd className="mt-1 text-xl font-black">{month.unique_athletes}</dd></div>
                <div><dt className="text-white/40">Bootcamp</dt><dd className="mt-1 text-xl font-black">{month.bootcamp_attendances}</dd></div>
                <div><dt className="text-white/40">HYROX</dt><dd className="mt-1 text-xl font-black">{month.hyrox_attendances}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      ) : <p className="mt-6 text-sm text-white/50">History will begin after December 2026 is complete.</p>}
    </section>
  );
}
