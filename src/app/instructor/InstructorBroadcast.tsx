"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type NotificationHistoryItem = {
  id: string;
  message: string;
  recipient_count: number;
  created_at: string;
  sent_by_name: string;
};

export default function InstructorBroadcast() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
  const [historyStatus, setHistoryStatus] = useState("Loading notification history…");

  const loadHistory = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_instructor_notification_history");
    if (error) {
      setHistoryStatus(error.message);
      return;
    }
    setHistory((data ?? []) as NotificationHistoryItem[]);
    setHistoryStatus("");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadHistory(), 0);
    return () => window.clearTimeout(timer);
  }, [loadHistory]);

  async function sendNotification() {
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      setStatus("Please enter a message first.");
      return;
    }
    if (!window.confirm(`Send this notification to all registered athletes?\n\n${cleanMessage}`)) return;

    setSending(true);
    setStatus("");
    const supabase = createClient();
    const { data, error } = await supabase.rpc("instructor_broadcast_notification", { p_message: cleanMessage });

    if (error) setStatus(error.message);
    else {
      const count = Number(data ?? 0);
      setMessage("");
      setStatus(`Notification sent to ${count} athlete${count === 1 ? "" : "s"}.`);
      await loadHistory();
    }
    setSending(false);
  }

  return (
    <section className="mt-10 rounded-[2rem] border border-pink/30 bg-pink/[.07] p-5 sm:p-7">
      <p className="eyebrow">Urgent athlete message</p>
      <h2 className="mt-2 text-2xl font-black uppercase">Send a notification</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Use this for important updates such as road closures, power cuts or last-minute gym information. It will appear in every athlete&apos;s Class Updates and as a phone notification where enabled.</p>
      <label className="mt-5 block">
        <span className="mb-2 block text-xs font-black uppercase tracking-wider text-pink">Message</span>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={300} rows={4} placeholder="Type the message athletes need to receive…" className="progress-input min-h-28 resize-y" />
      </label>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-white/35">{message.length}/300 characters</span>
        <button type="button" disabled={sending || !message.trim()} onClick={() => void sendNotification()} className="rounded-full bg-pink px-6 py-3 text-xs font-black text-white transition hover:bg-[#ff3b91] disabled:cursor-not-allowed disabled:opacity-40">{sending ? "Sending…" : "Send to all athletes"}</button>
      </div>
      {status && <p role="status" className="mt-4 text-sm font-bold text-pink">{status}</p>}

      <div className="mt-8 border-t border-white/10 pt-7">
        <p className="eyebrow">Previous messages</p>
        <h3 className="mt-2 text-xl font-black uppercase">Notification history</h3>
        {historyStatus ? (
          <p role="status" className="mt-4 text-sm text-white/50">{historyStatus}</p>
        ) : history.length ? (
          <div className="mt-5 space-y-3">
            {history.map((item) => {
              const sentAt = new Intl.DateTimeFormat("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Europe/London",
              }).format(new Date(item.created_at));
              return (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm leading-6 text-white/80">{item.message}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                    <span>{sentAt}</span>
                    <span>Sent by {item.sent_by_name}</span>
                    <span>{item.recipient_count} athlete{item.recipient_count === 1 ? "" : "s"}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-white/50">No instructor notifications have been recorded yet.</p>
        )}
      </div>
    </section>
  );
}
