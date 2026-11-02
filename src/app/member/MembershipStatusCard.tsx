"use client";

import { useState } from "react";

const membershipStatuses = {
  payg: {
    name: "Pay as you go",
    price: "£8",
    frequency: "per group session",
    description: "Book and pay for individual Bootcamp or HYROX sessions.",
  },
  monthly: {
    name: "Monthly",
    price: "£60",
    frequency: "per month",
    description: "Unlimited group sessions and gym usage.",
  },
  personal: {
    name: "1:1",
    price: "£35",
    frequency: "per hour",
    description: "Private personal-training sessions, with a block of 10 available for £250.",
  },
} as const;

type MembershipStatus = keyof typeof membershipStatuses;

export default function MembershipStatusCard() {
  const [status, setStatus] = useState<MembershipStatus>("monthly");
  const membership = membershipStatuses[status];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-6">
      <p className="text-xs font-black uppercase tracking-widest text-pink">
        Membership status
      </p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-2xl font-black">{membership.name}</p>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase text-emerald-400">
          Active
        </span>
      </div>
      <p className="mt-3 min-h-12 text-sm leading-6 text-white/50">
        {membership.description}
      </p>
      <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
        <span className="text-sm text-white/45">{membership.frequency}</span>
        <span className="text-2xl font-black">{membership.price}</span>
      </div>

      <label className="mt-6 block border-t border-white/10 pt-5">
        <span className="mb-2 block text-xs font-black uppercase tracking-widest text-white/40">
          Preview a membership status
        </span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as MembershipStatus)}
          className="progress-input"
        >
          <option value="payg">Pay as you go</option>
          <option value="monthly">Monthly</option>
          <option value="personal">1:1</option>
        </select>
      </label>
      <p className="mt-4 text-xs leading-5 text-white/35">
        This selector demonstrates each status. Members will not be able to
        change their own status without completing the relevant payment.
      </p>
    </section>
  );
}
