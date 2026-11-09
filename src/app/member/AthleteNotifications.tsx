"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read_at: string | null;
};

export default function AthleteNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("class_notifications")
      .select("id,title,message,created_at,read_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) setMessage("Class updates are temporarily unavailable.");
    else setNotifications((data ?? []) as Notification[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function markAllRead() {
    const unreadIds = notifications.filter((item) => !item.read_at).map((item) => item.id);
    if (!unreadIds.length) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("class_notifications")
      .update({ read_at: new Date().toISOString() })
      .in("id", unreadIds);
    if (error) setMessage("We could not mark the updates as read. Please try again.");
    else await load();
  }

  const unreadCount = notifications.filter((item) => !item.read_at).length;

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-pink">Class updates</p>
          <h2 className="mt-2 text-2xl font-black uppercase">Notifications</h2>
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={() => void markAllRead()} className="rounded-full border border-pink/40 px-4 py-2 text-xs font-black text-pink hover:bg-pink hover:text-white">
            Mark all read
          </button>
        )}
      </div>

      {message && <p role="status" className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{message}</p>}
      {loading ? (
        <p className="mt-6 text-sm text-white/45">Loading class updates…</p>
      ) : notifications.length ? (
        <div className="mt-6 grid gap-3">
          {notifications.map((item) => (
            <article key={item.id} className={`rounded-2xl border p-4 ${item.read_at ? "border-white/10 bg-white/[.025]" : "border-pink/40 bg-pink/[.08]"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-black">{item.title}</h3>
                {!item.read_at && <span className="rounded-full bg-pink px-2.5 py-1 text-[.65rem] font-black uppercase">New</span>}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/65">{item.message}</p>
              <p className="mt-3 text-xs text-white/35">{new Date(item.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-white/45">You do not have any class updates.</p>
      )}
    </section>
  );
}
