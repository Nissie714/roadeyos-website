"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function InstructorBroadcast() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

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
    </section>
  );
}
