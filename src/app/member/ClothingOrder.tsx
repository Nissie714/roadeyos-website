"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type GarmentId = "hoodie" | "crew" | "tshirt" | "dropShoulderTshirt";

type GarmentChoice = {
  selected: boolean;
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

const initialChoice: GarmentChoice = {
  selected: false,
  size: "M",
  colour: "Black",
  rearLogo: "Yes",
  logoColour: "Pink",
  hoodieStyle: "Overhead",
};

export default function ClothingOrder() {
  const [choices, setChoices] = useState<Record<GarmentId, GarmentChoice>>({
    hoodie: { ...initialChoice },
    crew: { ...initialChoice },
    tshirt: { ...initialChoice },
    dropShoulderTshirt: { ...initialChoice },
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const selectedGarments = useMemo(
    () => garments.filter((garment) => choices[garment.id].selected),
    [choices],
  );

  function updateChoice(id: GarmentId, update: Partial<GarmentChoice>) {
    setChoices((current) => ({
      ...current,
      [id]: { ...current[id], ...update },
    }));
  }

  async function submitOrder() {
    if (!selectedGarments.length) {
      setStatus("Please choose at least one clothing item.");
      return;
    }

    setSubmitting(true);
    setStatus("");
    const items = selectedGarments.map((garment) => {
      const choice = choices[garment.id];
      return {
        garment: garment.name,
        hoodie_style: garment.id === "hoodie" ? choice.hoodieStyle : null,
        size: choice.size,
        garment_colour: choice.colour,
        rear_logo: choice.rearLogo === "Yes",
        logo_colour: choice.rearLogo === "Yes" ? choice.logoColour : null,
      };
    });
    const supabase = createClient();
    const { error } = await supabase.rpc("submit_clothing_order", { p_items: items });
    setStatus(error ? error.message : "Your clothing order has been sent to the instructors.");
    setSubmitting(false);
  }

  return (
    <section className="mt-10 rounded-[2rem] border border-pink/25 bg-[#101010] p-5 sm:p-7">
      <p className="eyebrow">Road-e-yo&apos;s clothing</p>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-[-.03em]">Build your clothing order</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
        Select each item you would like, then choose the size, garment colour and rear-logo finish.
      </p>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {garments.map((garment) => {
          const choice = choices[garment.id];
          return (
            <article
              key={garment.id}
              className={`rounded-3xl border p-5 transition ${choice.selected ? "border-pink bg-pink/[.08]" : "border-white/10 bg-black/30"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black uppercase">{garment.name}</h3>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-xs font-black uppercase tracking-wide">
                  <input
                    type="checkbox"
                    checked={choice.selected}
                    onChange={(event) => updateChoice(garment.id, { selected: event.target.checked })}
                    className="h-5 w-5 accent-[#ff1478]"
                  />
                  Choose
                </label>
              </div>
              <p className="mt-3 min-h-12 text-sm leading-6 text-white/50">{garment.description}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {garment.id === "hoodie" && <SelectField label="Hoodie style" value={choice.hoodieStyle} options={["Zip front", "Overhead"]} disabled={!choice.selected} onChange={(value) => updateChoice(garment.id, { hoodieStyle: value as GarmentChoice["hoodieStyle"] })} />}
                <SelectField label="Size" value={choice.size} options={sizes} disabled={!choice.selected} onChange={(value) => updateChoice(garment.id, { size: value })} />
                <SelectField label="Garment colour" value={choice.colour} options={garmentColours} disabled={!choice.selected} onChange={(value) => updateChoice(garment.id, { colour: value })} />
                <SelectField label="Rear printed logo" value={choice.rearLogo} options={["Yes", "No"]} disabled={!choice.selected} onChange={(value) => updateChoice(garment.id, { rearLogo: value as "Yes" | "No" })} />
                <SelectField label="Logo colour" value={choice.logoColour} options={logoColours} disabled={!choice.selected || choice.rearLogo === "No"} onChange={(value) => updateChoice(garment.id, { logoColour: value })} />
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-[.2em] text-pink">Order summary</p>
        {selectedGarments.length ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {selectedGarments.map((garment) => {
              const choice = choices[garment.id];
              return (
                <li key={garment.id} className="rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm">
                  <span className="font-black uppercase">{garment.name}</span>
                  <span className="mt-1 block text-white/50">
                    {garment.id === "hoodie" ? `${choice.hoodieStyle} · ` : ""}{choice.size} · {choice.colour} · Rear logo: {choice.rearLogo}
                    {choice.rearLogo === "Yes" ? ` (${choice.logoColour})` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-white/45">Choose at least one clothing item to build your order.</p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <p className="text-xs text-white/40">Your instructors will confirm availability and payment separately.</p>
          <button type="button" disabled={submitting || !selectedGarments.length} onClick={() => void submitOrder()} className="rounded-full bg-pink px-6 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#ff3b91] disabled:cursor-not-allowed disabled:opacity-40">
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
