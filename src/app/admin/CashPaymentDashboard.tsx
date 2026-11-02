"use client";

import { FormEvent, useMemo, useState } from "react";

type Member = {
  id: string;
  name: string;
  email: string;
  monthlyActive: boolean;
  monthlyUntil: string | null;
  oneToOneCredits: number;
};

type PaymentRecord = {
  id: number;
  memberName: string;
  product: string;
  amount: string;
  date: string;
  method: "Cash";
};

type CompletedSession = {
  id: number;
  memberName: string;
  date: string;
  remainingCredits: number;
};

const initialMembers: Member[] = [
  {
    id: "member-001",
    name: "Example Member A",
    email: "member.a@example.com",
    monthlyActive: true,
    monthlyUntil: "2026-08-01",
    oneToOneCredits: 0,
  },
  {
    id: "member-002",
    name: "Example Member B",
    email: "member.b@example.com",
    monthlyActive: false,
    monthlyUntil: null,
    oneToOneCredits: 3,
  },
  {
    id: "member-003",
    name: "Example Member C",
    email: "member.c@example.com",
    monthlyActive: false,
    monthlyUntil: null,
    oneToOneCredits: 0,
  },
];

const paymentTypes = {
  monthly: {
    name: "Monthly membership",
    amount: "60.00",
    monthly: true,
    credits: 0,
  },
  "one-to-one": {
    name: "Single 1:1 session",
    amount: "35.00",
    monthly: false,
    credits: 1,
  },
  "ten-pack": {
    name: "Ten 1:1 sessions",
    amount: "250.00",
    monthly: false,
    credits: 10,
  },
} as const;

type PaymentType = keyof typeof paymentTypes;

function addOneMonth(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Not active";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateString}T12:00:00`));
}

function accessLabel(member: Member) {
  if (member.monthlyActive && member.oneToOneCredits > 0) return "Monthly + 1:1";
  if (member.monthlyActive) return "Monthly";
  if (member.oneToOneCredits > 0) return "1:1";
  return "Pay as you go";
}

export default function CashPaymentDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [members, setMembers] = useState(initialMembers);
  const [memberId, setMemberId] = useState(initialMembers[0].id);
  const [paymentType, setPaymentType] = useState<PaymentType>("monthly");
  const [paymentDate, setPaymentDate] = useState(today);
  const [sessionDate, setSessionDate] = useState(today);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
  const [message, setMessage] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");

  const selectedMember = useMemo(
    () => members.find((member) => member.id === memberId) ?? members[0],
    [memberId, members],
  );
  const selectedPayment = paymentTypes[paymentType];

  function recordPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMembers((current) =>
      current.map((member) => {
        if (member.id !== memberId) return member;
        const renewalBase =
          member.monthlyUntil && member.monthlyUntil > paymentDate
            ? member.monthlyUntil
            : paymentDate;

        return {
          ...member,
          monthlyActive: selectedPayment.monthly
            ? true
            : member.monthlyActive,
          monthlyUntil: selectedPayment.monthly
            ? addOneMonth(renewalBase)
            : member.monthlyUntil,
          oneToOneCredits:
            member.oneToOneCredits + selectedPayment.credits,
        };
      }),
    );

    setPayments((current) => [
      {
        id: Date.now(),
        memberName: selectedMember.name,
        product: selectedPayment.name,
        amount: `£${selectedPayment.amount}`,
        date: paymentDate,
        method: "Cash",
      },
      ...current,
    ]);

    setMessage(
      `Cash payment recorded for ${selectedMember.name}. Their member access has been updated in this preview.`,
    );
  }

  function recordCompletedSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedMember.oneToOneCredits < 1) {
      setSessionMessage(
        `${selectedMember.name} has no 1:1 session credits remaining.`,
      );
      return;
    }

    const remainingCredits = selectedMember.oneToOneCredits - 1;
    setMembers((current) =>
      current.map((member) =>
        member.id === memberId
          ? { ...member, oneToOneCredits: remainingCredits }
          : member,
      ),
    );
    setCompletedSessions((current) => [
      {
        id: Date.now(),
        memberName: selectedMember.name,
        date: sessionDate,
        remainingCredits,
      },
      ...current,
    ]);
    setSessionMessage(
      `1:1 session recorded for ${selectedMember.name}. ${remainingCredits} credit${remainingCredits === 1 ? "" : "s"} remaining.`,
    );
  }

  return (
    <div className="section-shell py-10 sm:py-14">
      <div className="rounded-2xl border border-pink/35 bg-pink/10 p-4">
        <p className="text-xs font-black uppercase tracking-widest text-pink">
          Admin preview
        </p>
        <p className="mt-1 text-sm leading-6 text-white/55">
          Example members only. Changes reset when the page refreshes and are
          not saved to real accounts.
        </p>
      </div>

      <div className="mt-9">
        <p className="eyebrow">Owner dashboard</p>
        <h1 className="mt-3 text-5xl font-black uppercase tracking-[-.05em] sm:text-6xl">
          Cash payments.
        </h1>
        <p className="mt-4 max-w-2xl text-white/55">
          Record a payment and automatically give the member the correct access.
        </p>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-6">
          <p className="text-xs font-black uppercase tracking-widest text-pink">
            Record payment
          </p>
          <form onSubmit={recordPayment} className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/65">
                Member
              </span>
              <select
                value={memberId}
                onChange={(event) => {
                  setMemberId(event.target.value);
                  setMessage("");
                }}
                className="progress-input"
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} · {member.email}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/65">
                Payment for
              </span>
              <select
                value={paymentType}
                onChange={(event) => {
                  setPaymentType(event.target.value as PaymentType);
                  setMessage("");
                }}
                className="progress-input"
              >
                <option value="monthly">Monthly membership · £60</option>
                <option value="one-to-one">Single 1:1 session · £35</option>
                <option value="ten-pack">Ten 1:1 sessions · £250</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/65">
                Date received
              </span>
              <input
                required
                type="date"
                value={paymentDate}
                onChange={(event) => {
                  setPaymentDate(event.target.value);
                  setMessage("");
                }}
                className="progress-input"
              />
            </label>
            <div className="rounded-xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/40">
                    Payment method
                  </p>
                  <p className="mt-2 font-black">Cash</p>
                </div>
                <p className="text-3xl font-black">£{selectedPayment.amount}</p>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-pink px-6 py-4 font-black transition hover:bg-[#ff3b91]"
            >
              Confirm cash received
            </button>
          </form>

          {message && (
            <p role="status" className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-400">
              {message}
            </p>
          )}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-pink">
                Member access
              </p>
              <h2 className="mt-2 text-2xl font-black">{selectedMember.name}</h2>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase text-emerald-400">
              {accessLabel(selectedMember)}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-white/40">
                Monthly access
              </p>
              <p className="mt-4 text-2xl font-black">
                {selectedMember.monthlyActive ? "Active" : "Not active"}
              </p>
              <p className="mt-2 text-sm text-white/45">
                {selectedMember.monthlyActive
                  ? `Access until ${formatDate(selectedMember.monthlyUntil)}`
                  : "Pay as you go class access"}
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-white/40">
                1:1 session credits
              </p>
              <p className="mt-4 text-4xl font-black text-pink">
                {selectedMember.oneToOneCredits}
              </p>
              <p className="mt-1 text-sm text-white/45">
                private sessions remaining
              </p>
            </article>
          </div>

          <div className="mt-6 rounded-2xl border border-pink/30 bg-pink/10 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-pink">
              Member screen access
            </p>
            <p className="mt-3 text-lg font-bold leading-7">
              {selectedMember.monthlyActive
                ? "Unlimited group-class booking and gym access are enabled."
                : "Group classes remain available on a pay-as-you-go basis."}
              {selectedMember.oneToOneCredits > 0
                ? ` The account can also book ${selectedMember.oneToOneCredits} private 1:1 session${selectedMember.oneToOneCredits === 1 ? "" : "s"}.`
                : ""}
            </p>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#101010] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-pink">
              Cash-payment log
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase">Recorded today</h2>
          </div>
          <span className="text-sm font-bold text-white/45">
            {payments.length} payment{payments.length === 1 ? "" : "s"}
          </span>
        </div>

        {payments.length > 0 ? (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead className="bg-black/35 text-xs uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Member</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-white/10">
                    <td className="px-5 py-4 text-sm text-white/55">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-5 py-4 font-bold">{payment.memberName}</td>
                    <td className="px-5 py-4 text-sm text-white/55">{payment.product}</td>
                    <td className="px-5 py-4 text-sm">{payment.method}</td>
                    <td className="px-5 py-4 font-black">{payment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">
            No cash payments have been recorded in this preview yet.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#101010] p-6">
        <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-pink">
              1:1 attendance
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase">
              Record completed session
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/50">
              Confirm that a private session took place and deduct one credit
              from the selected member.
            </p>

            <form onSubmit={recordCompletedSession} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-white/65">
                  Member
                </span>
                <select
                  value={memberId}
                  onChange={(event) => {
                    setMemberId(event.target.value);
                    setSessionMessage("");
                  }}
                  className="progress-input"
                >
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} · {member.oneToOneCredits} credit
                      {member.oneToOneCredits === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-white/65">
                  Session date
                </span>
                <input
                  required
                  type="date"
                  value={sessionDate}
                  onChange={(event) => {
                    setSessionDate(event.target.value);
                    setSessionMessage("");
                  }}
                  className="progress-input"
                />
              </label>
              <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-white/40">
                  Current balance
                </p>
                <p className="mt-2 text-3xl font-black text-pink">
                  {selectedMember.oneToOneCredits}
                </p>
                <p className="text-sm text-white/45">1:1 credits</p>
              </div>
              <button
                type="submit"
                disabled={selectedMember.oneToOneCredits < 1}
                className="w-full rounded-full bg-pink px-6 py-4 font-black transition enabled:hover:bg-[#ff3b91] disabled:cursor-not-allowed disabled:bg-pink/35 disabled:text-white/45"
              >
                Confirm session completed
              </button>
            </form>

            {sessionMessage && (
              <p
                role="status"
                className="mt-5 rounded-xl border border-pink/30 bg-pink/10 p-4 text-sm font-bold text-pink"
              >
                {sessionMessage}
              </p>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-xl font-black uppercase">Completed 1:1 log</h3>
              <span className="text-sm font-bold text-white/45">
                {completedSessions.length} recorded
              </span>
            </div>
            {completedSessions.length > 0 ? (
              <div className="mt-5 space-y-3">
                {completedSessions.map((session) => (
                  <article
                    key={session.id}
                    className="grid gap-3 rounded-xl border border-white/10 bg-black/25 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <p className="font-black">{session.memberName}</p>
                    <p className="text-sm text-white/50">
                      {formatDate(session.date)}
                    </p>
                    <p className="text-sm font-black text-pink">
                      {session.remainingCredits} remaining
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">
                No completed 1:1 sessions have been recorded in this preview.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
