const payments = [
  {
    date: "01 Jul 2026",
    description: "Unlimited monthly membership",
    method: "Card ending 4821",
    amount: "£60.00",
    status: "Paid",
  },
  {
    date: "01 Jun 2026",
    description: "Unlimited monthly membership",
    method: "Card ending 4821",
    amount: "£60.00",
    status: "Paid",
  },
  {
    date: "18 May 2026",
    description: "Private 1:1 session",
    method: "Card ending 4821",
    amount: "£35.00",
    status: "Paid",
  },
  {
    date: "01 May 2026",
    description: "Unlimited monthly membership",
    method: "Card ending 4821",
    amount: "£60.00",
    status: "Paid",
  },
];

export default function PaymentHistory() {
  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-pink">
            My account
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
            Payment history
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Review membership and session payments in one place.
          </p>
        </div>
        <span className="w-fit rounded-full border border-pink/35 bg-pink/10 px-4 py-2 text-xs font-black text-pink">
          SAMPLE DATA
        </span>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-black/35 text-xs uppercase tracking-widest text-white/45">
            <tr>
              <th className="px-5 py-4 font-black">Date</th>
              <th className="px-5 py-4 font-black">Payment</th>
              <th className="px-5 py-4 font-black">Method</th>
              <th className="px-5 py-4 font-black">Amount</th>
              <th className="px-5 py-4 font-black">Status</th>
              <th className="px-5 py-4 font-black">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={`${payment.date}-${payment.description}`} className="border-t border-white/10">
                <td className="whitespace-nowrap px-5 py-5 text-sm text-white/60">{payment.date}</td>
                <td className="px-5 py-5 font-bold">{payment.description}</td>
                <td className="px-5 py-5 text-sm text-white/50">{payment.method}</td>
                <td className="px-5 py-5 font-black">{payment.amount}</td>
                <td className="px-5 py-5">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-400">
                    {payment.status}
                  </span>
                </td>
                <td className="px-5 py-5">
                  <button disabled className="cursor-not-allowed text-sm font-black text-pink/55">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-xs leading-5 text-white/35">
        These entries demonstrate the planned layout only. Real payments and
        downloadable receipts will appear after secure payment processing is connected.
      </p>
    </section>
  );
}
