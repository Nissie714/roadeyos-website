"use client";

import { FormEvent, useState } from "react";

type PersonalBest = {
  activity: string;
  result: string;
  date: string;
};

const startingMeasurements = {
  waist: 92,
  hips: 108,
  chest: 101,
  thigh: 62,
};

const sampleBests: PersonalBest[] = [
  { activity: "5 km run", result: "27:42", date: "12 Jul 2026" },
  { activity: "Deadlift", result: "95 kg", date: "05 Jul 2026" },
  { activity: "1,000 m row", result: "4:08", date: "28 Jun 2026" },
];

export default function PerformanceTracker() {
  const [measurements, setMeasurements] = useState({
    waist: "89",
    hips: "105",
    chest: "99",
    thigh: "60",
  });
  const [measurementChecked, setMeasurementChecked] = useState(false);
  const [personalBests, setPersonalBests] = useState(sampleBests);
  const [activity, setActivity] = useState("Sled push");
  const [result, setResult] = useState("");
  const [bestAdded, setBestAdded] = useState(false);

  function updateMeasurement(name: keyof typeof measurements, value: string) {
    setMeasurements((current) => ({ ...current, [name]: value }));
    setMeasurementChecked(false);
  }

  function checkMeasurements(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMeasurementChecked(true);
  }

  function addPersonalBest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result.trim()) return;

    setPersonalBests((current) => [
      {
        activity,
        result: result.trim(),
        date: new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date()),
      },
      ...current,
    ]);
    setResult("");
    setBestAdded(true);
  }

  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-pink">
            My achievements
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
            Measurements &amp; personal bests
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Celebrate progress that the scales cannot always show and keep a
            record of the performances you are proud of.
          </p>
        </div>
        <span className="w-fit rounded-full border border-pink/35 bg-pink/10 px-4 py-2 text-xs font-black text-pink">
          PRIVATE PREVIEW
        </span>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6">
          <h3 className="text-xl font-black uppercase">Body measurements</h3>
          <p className="mt-2 text-sm leading-6 text-white/45">
            Current measurements are compared with the starting check-in.
          </p>

          <form onSubmit={checkMeasurements} className="mt-6 grid grid-cols-2 gap-4">
            {(
              [
                ["waist", "Waist"],
                ["hips", "Hips"],
                ["chest", "Chest"],
                ["thigh", "Thigh"],
              ] as const
            ).map(([key, label]) => {
              const current = Number(measurements[key]);
              const change = Number.isFinite(current)
                ? current - startingMeasurements[key]
                : 0;

              return (
                <label key={key} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
                  <span className="text-sm font-bold text-white/65">{label}</span>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      required
                      min="1"
                      max="300"
                      step="0.1"
                      type="number"
                      value={measurements[key]}
                      onChange={(event) => updateMeasurement(key, event.target.value)}
                      className="progress-input min-w-0"
                    />
                    <span className="text-sm font-bold text-white/40">cm</span>
                  </div>
                  <p className={`mt-3 text-xs font-black ${change < 0 ? "text-emerald-400" : "text-white/35"}`}>
                    {change === 0
                      ? "No change"
                      : `${change > 0 ? "+" : ""}${change.toFixed(1)} cm from start`}
                  </p>
                </label>
              );
            })}
            <button type="submit" className="col-span-2 rounded-full bg-pink px-6 py-3 font-black transition hover:bg-[#ff3b91]">
              Check my measurements
            </button>
          </form>

          {measurementChecked && (
            <p role="status" className="mt-4 rounded-xl border border-pink/30 bg-pink/10 p-4 text-sm font-bold text-pink">
              Brilliant consistency—your check-in is complete for this preview.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6">
          <h3 className="text-xl font-black uppercase">Personal bests</h3>
          <p className="mt-2 text-sm leading-6 text-white/45">
            Log a new result whenever you beat your own best.
          </p>

          <form onSubmit={addPersonalBest} className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label>
              <span className="sr-only">Activity</span>
              <select
                value={activity}
                onChange={(event) => {
                  setActivity(event.target.value);
                  setBestAdded(false);
                }}
                className="progress-input h-full"
              >
                <option>Sled push</option>
                <option>Sled pull</option>
                <option>5 km run</option>
                <option>1,000 m row</option>
                <option>Deadlift</option>
                <option>Squat</option>
                <option>Wall balls</option>
                <option>Other achievement</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Result</span>
              <input
                required
                type="text"
                value={result}
                onChange={(event) => {
                  setResult(event.target.value);
                  setBestAdded(false);
                }}
                placeholder="Result, e.g. 80 kg or 4:15"
                className="progress-input h-full"
              />
            </label>
            <button type="submit" className="rounded-full bg-pink px-5 py-3 text-sm font-black transition hover:bg-[#ff3b91]">
              Add best
            </button>
          </form>

          {bestAdded && (
            <p role="status" className="mt-4 text-sm font-bold text-pink">
              New personal best—outstanding work!
            </p>
          )}

          <div className="mt-6 space-y-3">
            {personalBests.map((best, index) => (
              <article
                key={`${best.activity}-${best.date}-${index}`}
                className="grid grid-cols-[1fr_auto] items-center gap-5 rounded-xl border border-white/10 bg-white/[.03] p-4"
              >
                <div>
                  <h4 className="font-black">{best.activity}</h4>
                  <p className="mt-1 text-xs text-white/40">{best.date}</p>
                </div>
                <p className="text-xl font-black text-pink">{best.result}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-white/35">
        Information entered here lasts only until the preview is refreshed. It
        will not be permanently saved until secure member storage is connected.
      </p>
    </section>
  );
}
