const sessionHistory = [
  { date: "18 Jul 2026", coach: "Yolanda", status: "Completed" },
  { date: "11 Jul 2026", coach: "Yolanda", status: "Completed" },
  { date: "04 Jul 2026", coach: "Yolanda", status: "Completed" },
];

export default function OneToOneBalance() {
  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-pink">
            Private training
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
            My 1:1 sessions
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/50">
            View remaining session credits and your completed private-training
            history.
          </p>
        </div>
        <span className="w-fit rounded-full border border-pink/35 bg-pink/10 px-4 py-2 text-xs font-black text-pink">
          SAMPLE DATA
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
        <article className="rounded-2xl border border-pink/40 bg-pink/10 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-pink">
            Sessions remaining
          </p>
          <p className="mt-4 text-6xl font-black tracking-[-.06em]">7</p>
          <p className="mt-2 text-sm text-white/50">from a block of 10</p>
          <button
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white/50"
          >
            Book a 1:1
          </button>
        </article>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-black uppercase">Completed sessions</h3>
            <span className="text-xs font-bold text-white/40">
              Updated by Road-e-yo&apos;s
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {sessionHistory.map((session) => (
              <article
                key={session.date}
                className="grid gap-2 rounded-xl border border-white/10 bg-white/[.03] p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <p className="font-bold">{session.date}</p>
                <p className="text-sm text-white/45">{session.coach}</p>
                <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-400">
                  {session.status}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-white/35">
        In the live system, this balance will decrease automatically whenever
        an administrator records a completed 1:1 session.
      </p>
    </section>
  );
}
