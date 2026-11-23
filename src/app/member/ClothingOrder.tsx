"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { clothingColours, clothingColourHex } from "./clothingColours";

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
const logoColours = ["Pink", "White", "Black"];
const maxItems = 20;

type SavedOrder = {
  id: string;
  items: Array<{
    garment: string;
    hoodie_style: string | null;
    size: string;
    garment_colour: string;
    garment_colour_hex?: string;
    rear_logo: boolean;
    logo_colour: string | null;
  }>;
  status: string;
  created_at: string;
};

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
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);
  const [historyStatus, setHistoryStatus] = useState("Loading your orders…");

  const loadOrders = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_my_clothing_orders");
    if (error) setHistoryStatus("Your order history is temporarily unavailable.");
    else {
      setSavedOrders((data ?? []) as SavedOrder[]);
      setHistoryStatus("");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadOrders(), 0);
    return () => window.clearTimeout(timer);
  }, [loadOrders]);

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
        garment_colour_hex: clothingColourHex(choice.colour),
        rear_logo: choice.rearLogo === "Yes",
        logo_colour: choice.rearLogo === "Yes" ? choice.logoColour : null,
    })));
    const supabase = createClient();
    const { data, error } = await supabase.rpc("submit_clothing_order", { p_items: items });
    if (error) setStatus(error.message);
    else {
      setChoices({ hoodie: [], crew: [], tshirt: [], dropShoulderTshirt: [] });
      setStatus(`Your clothing order has been sent to the instructors. Reference: ${String(data).slice(0, 8).toUpperCase()}.`);
      await loadOrders();
    }
    setSubmitting(false);
  }

  return (
    <section className="mt-10 rounded-[2rem] border border-pink/25 bg-[#101010] p-5 sm:p-7">
      <p className="eyebrow">Road-e-yo&apos;s clothing</p>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-[-.03em]">Build your clothing order</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
        Add as many of each clothing type as you need. Choose the size, garment colour and rear-logo finish separately for every item.
        Colour swatches are approximate; instructors will confirm availability.
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
                      <ColourField value={choice.colour} disabled={submitting} onChange={(value) => updateChoice(garment.id, choice.id, { colour: value })} />
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

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-black uppercase">Your clothing orders</h3>
          <button type="button" onClick={() => void loadOrders()} className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/70 hover:border-pink hover:text-white">Refresh orders</button>
        </div>
        <p className="mt-2 text-sm text-white/50">Past orders stay here for reference. If an instructor cancels an order, you can submit a new one above.</p>
        {historyStatus ? <p role="status" className="mt-4 text-sm text-white/50">{historyStatus}</p> : savedOrders.length ? (
          <div className="mt-5 space-y-4">
            {savedOrders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-black">Order {order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="mt-1 text-xs text-white/45">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" }).format(new Date(order.created_at))}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${order.status === "Cancelled" ? "bg-red-400/15 text-red-300" : "bg-pink/15 text-pink"}`}>{order.status}</span>
                </div>
                {order.status === "Cancelled" && <p className="mt-3 text-sm font-bold text-pink">This order was cancelled. You can place a new order above.</p>}
                <ul className="mt-4 grid gap-2 md:grid-cols-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="rounded-xl border border-white/10 p-3 text-sm text-white/65">
                      <p className="font-bold text-white">{item.garment}</p>
                      <p className="mt-1">{item.hoodie_style ? `${item.hoodie_style} · ` : ""}{item.size} · {item.garment_colour}</p>
                      <p>Rear logo: {item.rear_logo ? `Yes (${item.logo_colour})` : "No"}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : <p className="mt-4 text-sm text-white/45">You have not sent a clothing order yet.</p>}
      </div>
    </section>
  );
}

function ColourField({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-wide text-white/55">Garment colour</span>
        <span className="flex items-center gap-3">
          <span className="h-8 w-8 shrink-0 rounded-md border border-white/30" style={{ backgroundColor: clothingColourHex(value) }} aria-hidden="true" />
          <select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="progress-input disabled:cursor-not-allowed disabled:opacity-35">
            {clothingColours.map((colour) => <option key={colour.name} value={colour.name}>{colour.name}</option>)}
          </select>
        </span>
      </label>
      <details className="mt-2 text-sm text-white/60">
        <summary className="cursor-pointer text-pink">View colour chart</summary>
        <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8" role="group" aria-label="Garment colour swatches">
          {clothingColours.map((colour) => (
            <button key={colour.name} type="button" disabled={disabled} onClick={() => onChange(colour.name)} title={colour.name} aria-label={`Choose ${colour.name}`} aria-pressed={value === colour.name} className={`h-9 rounded-md border-2 transition disabled:opacity-40 ${value === colour.name ? "border-pink ring-2 ring-pink/50" : "border-white/20 hover:border-white"}`} style={{ backgroundColor: colour.hex }} />
          ))}
        </div>
      </details>
    </div>
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
