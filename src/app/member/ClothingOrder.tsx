"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type GarmentId = "hoodie" | "crew" | "tshirt" | "dropShoulderTshirt";

type GarmentChoice = {
  id: number;
  size: string;
  colour: string;
  rearLogo: "Yes" | "No";
  logoColour: string;
  hoodieStyle: "Zip front" | "Overhead";
};

const garments: Array<{ id: GarmentId; name: string; description: string }> = [
  { id: "hoodie", name: "Hoodie", description: "Warm hoodie for training days and everyday wear." },
  { id: "crew", name: "Crew jumper", description: "Classic crew-neck sweatshirt with a clean athletic fit." },
  { id: "tshirt", name: "T-shirt", description: "Lightweight Road-e-yo’s training T-shirt." },
  { id: "dropShoulderTshirt", name: "Drop Shoulder T-shirt", description: "Relaxed-fit T-shirt with a drop-shoulder shape." },
];

const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const garmentColours = ["Black", "Hot pink", "Charcoal", "White", "Navy"];
const logoColours = ["Pink", "White", "Black"];
const maxItems = 20;

const initialChoice: GarmentChoice = {
  id: 0,
  size: "M",
  colour: "Black",
  rearLogo: "Yes",
  logoColour: "Pink",
  hoodieStyle: "Overhead",
};

export default function ClothingOrder() {
  const [choices, setChoices] = useState<Record<GarmentId, GarmentChoice[]>>({
    hoodie: [],
    crew: [],
    tshirt: [],
    dropShoulderTshirt: [],
  });
  const [nextId, setNextId] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const itemCount = garments.reduce((count, garment) => count + choices[garment.id].length, 0);

  function addChoice(id: GarmentId) {
    if (itemCount >= maxItems) return;
    setChoices((current) => ({
      ...current,
      [id]: [...current[id], { ...initialChoice, id: nextId }],
    }));
    setNextId((current) => current + 1);
    setStatus("");
  }

  function updateChoice(garmentId: GarmentId, choiceId: number, update: Partial<GarmentChoice>) {
    setChoices((current) => ({
      ...current,
      [garmentId]: current[garmentId].map((choice) => choice.id === choiceId ? { ...choice, ...update } : choice),
    }));
  }

  function removeChoice(garmentId: GarmentId, choiceId: number) {
    setChoices((current) => ({
      ...current,
      [garmentId]: current[garmentId].filter((choice) => choice.id !== choiceId),
    }));
    setStatus("");
  }

  async function submitOrder() {
    if (!itemCount) {
      setStatus("Please add at least one clothing item.");
      return;
    }

    setSubmitting(true);
    setStatus("");
    const items = garments.flatMap((garment) => choices[garment.id].map((choice) => ({
        garment: garment.name,
        hoodie_style: garment.id === "hoodie" ? choice.hoodieStyle : null,
        size: choice.size,
        garment_colour: choice.colour,
        rear_logo: choice.rearLogo === "Yes",
        logo_colour: choice.rearLogo === "Yes" ? choice.logoColour : null,
    })));
    const supabase = createClient();
    const { error } = await supabase.rpc("submit_clothing_order", { p_items: items });
    if (error) setStatus(error.message);
    else {
      setChoices({ hoodie: [], crew: [], tshirt: [], dropShoulderTshirt: [] });
      setStatus("Your clothing order has been sent to the instructors.");
    }
    setSubmitting(false);
  }

  return (
    <section className="mt-10 rounded-[2rem] border border-pink/25 bg-[#101010] p-5 sm:p-7">
      <p className="eyebrow">Road-e-yo&apos;s clothing</p>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-[-.03em]">Build your clothing order</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
        Add as many of each clothing type as you need. Choose the size, garment colour and rear-logo finish separately for every item.
      </p>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {garments.map((garment) => {
          const garmentChoices = choices[garment.id];
          return (
            <article
              key={garment.id}
              className={`rounded-3xl border p-5 transition ${garmentChoices.length ? "border-pink bg-pink/[.08]" : "border-white/10 bg-black/30"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black uppercase">{garment.name}</h3>
                </div>
                <button type="button" disabled={submitting || itemCount >= maxItems} onClick={() => addChoice(garment.id)} className="rounded-full border border-pink px-4 py-2 text-xs font-black uppercase tracking-wide text-pink transition hover:bg-pink/10 disabled:cursor-not-allowed disabled:opacity-40">Add item</button>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/50">{garment.description}</p>

              <div className="mt-5 space-y-4">
                {garmentChoices.map((choice, index) => (
                  <div key={choice.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-black uppercase">{garment.name} {index + 1}</p>
                      <button type="button" disabled={submitting} onClick={() => removeChoice(garment.id, choice.id)} className="text-xs font-bold text-pink underline underline-offset-2 disabled:opacity-40" aria-label={`Remove ${garment.name} ${index + 1}`}>Remove</button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {garment.id === "hoodie" && <SelectField label="Hoodie style" value={choice.hoodieStyle} options={["Zip front", "Overhead"]} disabled={submitting} onChange={(value) => updateChoice(garment.id, choice.id, { hoodieStyle: value as GarmentChoice["hoodieStyle"] })} />}
                      <SelectField label="Size" value={choice.size} options={sizes} disabled={submitting} onChange={(value) => updateChoice(garment.id, choice.id, { size: value })} />
                      <SelectField label="Garment colour" value={choice.colour} options={garmentColours} disabled={submitting} onChange={(value) => updateChoice(garment.id, choice.id, { colour: value })} />
                      <SelectField label="Rear printed logo" value={choice.rearLogo} options={["Yes", "No"]} disabled={submitting} onChange={(value) => updateChoice(garment.id, choice.id, { rearLogo: value as "Yes" | "No" })} />
                      <SelectField label="Logo colour" value={choice.logoColour} options={logoColours} disabled={submitting || choice.rearLogo === "No"} onChange={(value) => updateChoice(garment.id, choice.id, { logoColour: value })} />
                    </div>
                  </div>
                ))}
                {!garmentChoices.length && <p className="text-sm text-white/40">No {garment.name.toLowerCase()} added yet.</p>}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-[.2em] text-pink">Order summary · {itemCount} {itemCount === 1 ? "item" : "items"}</p>
        {itemCount ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {garments.flatMap((garment) => choices[garment.id].map((choice) => (
                <li key={choice.id} className="rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm">
                  <span className="font-black uppercase">{garment.name}</span>
                  <span className="mt-1 block text-white/50">
                    {garment.id === "hoodie" ? `${choice.hoodieStyle} · ` : ""}{choice.size} · {choice.colour} · Rear logo: {choice.rearLogo}
                    {choice.rearLogo === "Yes" ? ` (${choice.logoColour})` : ""}
                  </span>
                </li>
            )))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-white/45">Add at least one clothing item to build your order.</p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <p className="text-xs text-white/40">Up to {maxItems} items per order. Your instructors will confirm availability and payment separately.</p>
          <button type="button" disabled={submitting || !itemCount} onClick={() => void submitOrder()} className="rounded-full bg-pink px-6 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#ff3b91] disabled:cursor-not-allowed disabled:opacity-40">
            {submitting ? "Sending…" : "Send clothing order"}
          </button>
        </div>
        {status && <p role="status" className="mt-4 text-sm font-bold text-pink">{status}</p>}
      </div>
    </section>
  );
}

function SelectField({ label, value, options, disabled, onChange }: { label: string; value: string; options: string[]; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-white/55">{label}</span>
      <select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="progress-input disabled:cursor-not-allowed disabled:opacity-35">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
