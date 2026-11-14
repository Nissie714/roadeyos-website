"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Answer = "yes" | "no" | "";

type StoredDeclaration = {
  answers: Record<string, boolean>;
  signature_name: string;
  declaration_status: "self_declared_fit" | "advice_required";
  signed_at: string;
};

const questions = [
  { id: "heart_condition", text: "Has a doctor ever said that you have a heart condition or high blood pressure and should only do physical activity recommended by a medical professional?" },
  { id: "chest_pain_activity", text: "Do you feel pain or discomfort in your chest during physical activity?" },
  { id: "chest_pain_rest", text: "During the past month, have you experienced chest pain when you were not exercising?" },
  { id: "dizziness_fainting", text: "Do you lose balance because of dizziness, or have you lost consciousness or fainted?" },
  { id: "joint_problem", text: "Do you have a bone, joint, muscle or soft-tissue problem that could be made worse by physical activity?" },
  { id: "heart_medication", text: "Are you currently prescribed medication for blood pressure or a heart condition?" },
  { id: "other_reason", text: "Is there any other health reason why you should not take part in physical activity without first seeking advice?" },
] as const;

function emptyAnswers(): Record<string, Answer> {
  return Object.fromEntries(questions.map((question) => [question.id, ""])) as Record<string, Answer>;
}

export default function HealthDeclaration() {
  const [answers, setAnswers] = useState<Record<string, Answer>>(emptyAnswers);
  const [signature, setSignature] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [medicalApprovalConfirmed, setMedicalApprovalConfirmed] = useState(false);
  const [existing, setExisting] = useState<StoredDeclaration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_my_health_declaration");
      if (!error && data?.[0]) setExisting(data[0] as StoredDeclaration);
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const allAnswered = useMemo(() => questions.every((question) => answers[question.id] !== ""), [answers]);
  const hasYesAnswer = useMemo(() => questions.some((question) => answers[question.id] === "yes"), [answers]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allAnswered) {
      setMessage("Please answer every health question.");
      return;
    }
    if (!confirmed || !signature.trim()) {
      setMessage("Please tick the declaration and enter your full name as your digital signature.");
      return;
    }

    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const booleanAnswers = {
      ...Object.fromEntries(Object.entries(answers).map(([key, value]) => [key, value === "yes"])),
      medical_approval_confirmed: hasYesAnswer && medicalApprovalConfirmed,
    };
    const declarationStatus = hasYesAnswer && !medicalApprovalConfirmed ? "advice_required" : "self_declared_fit";
    const { data, error } = await supabase.rpc("save_my_health_declaration", {
      p_answers: booleanAnswers,
      p_signature_name: signature.trim(),
      p_declaration_status: declarationStatus,
    });

    if (error) setMessage(error.message);
    else {
      setExisting({
        answers: booleanAnswers,
        signature_name: signature.trim(),
        declaration_status: declarationStatus,
        signed_at: String(data),
      });
      setMessage(
        declarationStatus === "advice_required"
          ? "Your PAR-Q has been saved. Class booking is locked until you have received medical approval to train. Please contact Yolanda to discuss suitable exercise options."
          : hasYesAnswer
            ? "Your signed PAR-Q and medical approval confirmation have been saved. You can now book classes."
            : "Your signed PAR-Q health declaration has been saved. You can now book classes.",
      );
      setSignature("");
      setConfirmed(false);
      setMedicalApprovalConfirmed(false);
    }
    setSaving(false);
  }

  if (loading) return null;

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-7">
      <p className="text-xs font-black uppercase tracking-widest text-pink">Pre-exercise screening</p>
      <h2 className="mt-2 text-2xl font-black uppercase">PAR-Q health declaration</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
        Please answer honestly before taking part in a Road-e-yo&apos;s session. This screening does not provide a diagnosis or replace advice from a doctor or other qualified healthcare professional.
      </p>

      {existing && (
        <div className={`mt-5 rounded-2xl border p-4 ${existing.declaration_status === "self_declared_fit" ? "border-emerald-400/30 bg-emerald-400/10" : "border-amber-300/30 bg-amber-300/10"}`}>
          <p className="font-black">
            {existing.declaration_status === "self_declared_fit" ? "Signed declaration on file" : "Medical approval required"}
          </p>
          <p className="mt-1 text-sm text-white/55">
            Signed by {existing.signature_name} on {new Date(existing.signed_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Complete the form again if your health changes.
          </p>
        </div>
      )}

      <form onSubmit={submit} className="mt-6">
        <div className="grid gap-3">
          {questions.map((question, index) => (
            <fieldset key={question.id} className="rounded-2xl border border-white/10 bg-white/[.025] p-4">
              <legend className="sr-only">Question {index + 1}</legend>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <p className="max-w-3xl text-sm font-bold leading-6"><span className="mr-2 text-pink">{index + 1}.</span>{question.text}</p>
                <div className="flex shrink-0 gap-2">
                  {(["no", "yes"] as const).map((value) => (
                    <label key={value} className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-black uppercase transition ${answers[question.id] === value ? "border-pink bg-pink text-white" : "border-white/15 text-white/55 hover:border-pink/50"}`}>
                      <input
                        type="radio"
                        name={question.id}
                        value={value}
                        checked={answers[question.id] === value}
                        onChange={() => setAnswers((current) => ({ ...current, [question.id]: value }))}
                        className="sr-only"
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>
          ))}
        </div>

        {allAnswered && hasYesAnswer && (
          <div className="mt-5 rounded-2xl border border-amber-300/35 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">
            One or more answers indicate a health matter or physical niggle. You may still take part once you have discussed every issue with a doctor or qualified healthcare professional and they have approved you to train. If you do not yet have that approval, class booking will remain locked and you should contact Yolanda to discuss suitable exercise options.
          </div>
        )}

        {allAnswered && hasYesAnswer && (
          <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/[.08] p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={medicalApprovalConfirmed}
                onChange={(event) => setMedicalApprovalConfirmed(event.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-pink"
              />
              <span className="text-sm font-bold leading-6">
                I confirm that I have discussed every health issue, injury or physical niggle identified above with a doctor or qualified healthcare professional, and they have approved me to take part in Road-e-yo&apos;s training sessions.
              </span>
            </label>
            <p className="mt-3 text-xs leading-5 text-white/45">
              Only tick this box if medical approval has already been given. If you are unsure, leave it unticked and contact Yolanda before booking.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-pink/25 bg-pink/[.06] p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-pink" />
            <span className="text-sm font-bold leading-6">
              {hasYesAnswer
                ? medicalApprovalConfirmed
                  ? "I confirm that my answers are accurate, that medical approval to train has been given, and that I will tell Road-e-yo's if my health, injury, symptoms or medication changes."
                  : "I confirm that my answers are accurate. I understand that I cannot book a class until I have received medical approval to train and discussed suitable exercise options with Yolanda."
                : "I confirm that my answers are accurate and, to the best of my knowledge, I am fit and healthy to take part in Road-e-yo's sessions."}
            </span>
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-pink">Digital signature — enter your full name</span>
            <input value={signature} onChange={(event) => setSignature(event.target.value)} autoComplete="name" className="progress-input" placeholder="Full name" />
          </label>
          <p className="mt-3 text-xs leading-5 text-white/40">By submitting, you confirm that typing your name is your electronic signature. Update this declaration promptly if your health or medication changes.</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <a href="https://eparmedx.com/print-versions-of-par-q/" target="_blank" rel="noreferrer" className="text-sm font-bold text-pink underline decoration-pink/40 underline-offset-4 hover:text-white">
            View the official PAR-Q+ information
          </a>
          <button disabled={saving || !allAnswered || !confirmed || !signature.trim()} className="rounded-full bg-pink px-6 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40">
            {saving ? "Saving…" : "Sign and save declaration"}
          </button>
        </div>
        {message && <p role="status" className="mt-4 text-sm font-bold text-pink">{message}</p>}
      </form>
    </section>
  );
}
