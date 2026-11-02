"use client";

import { FormEvent, useMemo, useState } from "react";

function encouragement(progress: number, lost: number) {
  if (lost <= 0) {
    return "Every journey starts with one honest check-in. You’ve got this.";
  }
  if (progress >= 100) {
    return "Goal achieved — an incredible result. Be proud of the work you put in!";
  }
  if (progress >= 75) {
    return "The finish line is in sight. Your consistency is really paying off!";
  }
  if (progress >= 50) {
    return "Over halfway there — that is a brilliant milestone. Keep going!";
  }
  if (progress >= 25) {
    return "Fantastic progress. The small choices are adding up to something big!";
  }
  return "A strong start. Keep showing up and give yourself credit for every step!";
}

export default function WeightProgressTracker() {
  const [startWeight, setStartWeight] = useState("95");
  const [currentWeight, setCurrentWeight] = useState("90");
  const [goalWeight, setGoalWeight] = useState("80");
  const [submitted, setSubmitted] = useState(true);

  const result = useMemo(() => {
    const start = Number(startWeight);
    const current = Number(currentWeight);
    const goal = Number(goalWeight);
    const totalToLose = start - goal;
    const lost = Math.max(0, start - current);
    const remaining = Math.max(0, current - goal);
    const valid = start > 0 && current > 0 && goal > 0 && totalToLose > 0;
    const progress = valid
      ? Math.min(100, Math.max(0, (lost / totalToLose) * 100))
      : 0;

    return { valid, lost, remaining, progress };
  }, [startWeight, currentWeight, goalWeight]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-pink">
            My progress
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
            Weight-loss tracker
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Add your latest weight to see how far you have come. This preview
            does not save or send the information you enter.
          </p>
        </div>
        <span className="w-fit rounded-full border border-pink/35 bg-pink/10 px-4 py-2 text-xs font-black text-pink">
          PRIVATE PREVIEW
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-white/10 bg-black/25 p-5 sm:grid-cols-3 lg:grid-cols-1"
        >
          <label>
            <span className="mb-2 block text-sm font-bold text-white/65">
              Starting weight (kg)
            </span>
            <input
              required
              min="1"
              max="500"
              step="0.1"
              type="number"
              value={startWeight}
              onChange={(event) => {
                setStartWeight(event.target.value);
                setSubmitted(false);
              }}
              className="progress-input"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-white/65">
              Current weight (kg)
            </span>
            <input
              required
              min="1"
              max="500"
              step="0.1"
              type="number"
              value={currentWeight}
              onChange={(event) => {
                setCurrentWeight(event.target.value);
                setSubmitted(false);
              }}
              className="progress-input"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-white/65">
              Target weight (kg)
            </span>
            <input
              required
              min="1"
              max="500"
              step="0.1"
              type="number"
              value={goalWeight}
              onChange={(event) => {
                setGoalWeight(event.target.value);
                setSubmitted(false);
              }}
              className="progress-input"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-pink px-6 py-3 font-black transition hover:bg-[#ff3b91] sm:col-span-3 lg:col-span-1"
          >
            Update my progress
          </button>
        </form>

        <div className="rounded-2xl border border-pink/30 bg-pink/10 p-6 sm:p-8">
          {result.valid && submitted ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-sm font-bold text-white/55">Goal progress</p>
                  <p className="mt-1 text-5xl font-black tracking-[-.05em]">
                    {Math.round(result.progress)}%
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-7 text-right">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/45">Lost</p>
                    <p className="mt-1 text-xl font-black">{result.lost.toFixed(1)} kg</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/45">To goal</p>
                    <p className="mt-1 text-xl font-black">{result.remaining.toFixed(1)} kg</p>
                  </div>
                </div>
              </div>
              <div
                className="mt-7 h-4 overflow-hidden rounded-full bg-black/35"
                role="progressbar"
                aria-label="Weight goal progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(result.progress)}
              >
                <div
                  className="h-full rounded-full bg-pink transition-[width] duration-500"
                  style={{ width: `${result.progress}%` }}
                />
              </div>
              <div className="mt-7 rounded-2xl bg-black/25 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-pink">
                  A message from Road-e-yo&apos;s
                </p>
                <p className="mt-3 text-lg font-bold leading-7">
                  {encouragement(result.progress, result.lost)}
                </p>
              </div>
            </>
          ) : (
            <div className="grid min-h-64 place-items-center text-center">
              <div>
                <p className="text-2xl font-black">Ready for your check-in?</p>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
                  Enter a starting weight above your target, then select
                  “Update my progress.”
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-5 text-xs leading-5 text-white/35">
        Progress information is for motivation only and is not medical advice.
        Members should speak to a qualified healthcare professional before
        making significant changes to diet or exercise.
      </p>
    </section>
  );
}
