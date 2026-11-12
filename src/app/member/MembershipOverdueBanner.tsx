"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Membership = {
  renewal_due_on: string;
  status: string;
};

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysUntil(dateKey: string) {
  const today = localDateKey(new Date());
  const due = Date.parse(`${dateKey}T00:00:00Z`);
  const current = Date.parse(`${today}T00:00:00Z`);
  return Math.round((due - current) / 86_400_000);
}

export default function MembershipOverdueBanner() {
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const { data, error } = await createClient().rpc("get_my_monthly_membership");
      if (!error) setMembership((data?.[0] as Membership | undefined) ?? null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!membership || membership.status !== "active") {
    return null;
  }

  const remainingDays = daysUntil(membership.renewal_due_on);
  if (remainingDays > 4) return null;

  const overdue = remainingDays < 0;
  const overdueDays = Math.abs(remainingDays);
  const dueMessage = remainingDays === 0
    ? "Your monthly membership is due today."
    : `Your monthly membership is due in ${remainingDays} day${remainingDays === 1 ? "" : "s"}.`;

  return (
    <div role="alert" className="mt-5 max-w-2xl rounded-2xl border border-pink/45 bg-pink/[.12] px-5 py-4">
      <p className="text-xs font-black uppercase tracking-widest text-pink">{overdue ? "Membership overdue" : "Membership due soon"}</p>
      <p className="mt-2 text-lg font-black">{overdue ? `Your monthly membership is ${overdueDays} day${overdueDays === 1 ? "" : "s"} overdue.` : dueMessage}</p>
      <p className="mt-1 text-sm leading-6 text-white/60">{overdue ? "Please arrange payment with a Road-e-yo's instructor." : "Please arrange your renewal with a Road-e-yo's instructor."} This message will clear when your new membership date is recorded.</p>
    </div>
  );
}
