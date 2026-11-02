const attendance = [
  { date: "03 Jul", className: "HYROX", status: "attended" },
  { date: "04 Jul", className: "Bootcamp", status: "attended" },
  { date: "06 Jul", className: "Bootcamp", status: "attended" },
  { date: "07 Jul", className: "HYROX", status: "missed" },
  { date: "08 Jul", className: "Bootcamp", status: "attended" },
  { date: "10 Jul", className: "HYROX", status: "attended" },
  { date: "11 Jul", className: "Bootcamp", status: "attended" },
  { date: "13 Jul", className: "Bootcamp", status: "attended" },
  { date: "14 Jul", className: "HYROX", status: "attended" },
  { date: "17 Jul", className: "HYROX", status: "attended" },
  { date: "18 Jul", className: "Bootcamp", status: "attended" },
  { date: "20 Jul", className: "Bootcamp", status: "attended" },
  { date: "21 Jul", className: "HYROX", status: "attended" },
  { date: "24 Jul", className: "HYROX", status: "attended" },
  { date: "27 Jul", className: "Bootcamp", status: "upcoming" },
  { date: "28 Jul", className: "HYROX", status: "upcoming" },
];

export default function AttendanceStreakTracker() {
  const attended = attendance.filter((item) => item.status === "attended").length;
  const completed = attendance.filter((item) => item.status !== "upcoming").length;
  const attendanceRate = Math.round((attended / completed) * 100);

  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-pink">
            Keep showing up
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
            Attendance streak
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Your streak updates automatically when Road-e-yo&apos;s records your
            class attendance.
          </p>
        </div>
        <span className="w-fit rounded-full border border-pink/35 bg-pink/10 px-4 py-2 text-xs font-black text-pink">
          SAMPLE DATA
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-pink/40 bg-pink/10 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-pink">
            Current streak
          </p>
          <p className="mt-3 text-5xl font-black tracking-[-.06em]">5</p>
          <p className="mt-1 text-sm text-white/50">classes in a row</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-white/45">
            Personal best
          </p>
          <p className="mt-3 text-5xl font-black tracking-[-.06em]">8</p>
          <p className="mt-1 text-sm text-white/50">classes in a row</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-white/45">
            Attendance rate
          </p>
          <p className="mt-3 text-5xl font-black tracking-[-.06em]">
            {attendanceRate}%
          </p>
          <p className="mt-1 text-sm text-white/50">{attended} classes attended</p>
        </article>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-black uppercase">July activity</h3>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-white/45">
            <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-pink" />Attended</span>
            <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-white/20" />Missed</span>
            <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full border border-pink" />Upcoming</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {attendance.map((item) => (
            <div
              key={`${item.date}-${item.className}`}
              title={`${item.date}: ${item.className} - ${item.status}`}
              className={`grid aspect-square place-items-center rounded-xl border text-center ${
                item.status === "attended"
                  ? "border-pink bg-pink text-white"
                  : item.status === "missed"
                    ? "border-white/10 bg-white/[.04] text-white/35"
                    : "border-pink/55 bg-transparent text-pink"
              }`}
            >
              <div>
                <p className="text-xs font-black">{item.date.split(" ")[0]}</p>
                <p className="text-[.6rem] font-bold uppercase">{item.date.split(" ")[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-pink/30 bg-pink/10 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-pink">
          Road-e-yo&apos;s says
        </p>
        <p className="mt-3 text-lg font-bold leading-7">
          Five classes without breaking your streak—brilliant consistency!
          Three more and you will match your personal best.
        </p>
      </div>
    </section>
  );
}
