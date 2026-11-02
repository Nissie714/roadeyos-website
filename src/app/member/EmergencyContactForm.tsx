"use client";

import { FormEvent, useState } from "react";

export default function EmergencyContactForm() {
  const [checked, setChecked] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-6">
      <p className="text-xs font-black uppercase tracking-widest text-pink">
        Safety information
      </p>
      <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
        Emergency contact
      </h2>
      <p className="mt-3 text-sm leading-6 text-white/50">
        Add someone Road-e-yo&apos;s can contact if there is an emergency during
        your visit.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-white/65">
            Contact&apos;s full name
          </span>
          <input
            required
            type="text"
            autoComplete="name"
            placeholder="Full name"
            onChange={() => setChecked(false)}
            className="progress-input"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-white/65">
            Relationship to you
          </span>
          <input
            required
            type="text"
            placeholder="For example, partner or parent"
            onChange={() => setChecked(false)}
            className="progress-input"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-white/65">
            Contact telephone number
          </span>
          <input
            required
            type="tel"
            autoComplete="tel"
            placeholder="Telephone number"
            onChange={() => setChecked(false)}
            className="progress-input"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-pink px-5 py-3 text-sm font-black transition hover:bg-[#ff3b91]"
        >
          Check contact details
        </button>
      </form>

      {checked && (
        <div role="status" className="mt-4 rounded-xl border border-pink/30 bg-pink/10 p-4">
          <p className="text-sm font-bold text-pink">
            Details complete for this preview.
          </p>
          <p className="mt-1 text-xs leading-5 text-white/45">
            They have not been saved or sent anywhere.
          </p>
        </div>
      )}

      <p className="mt-5 text-xs leading-5 text-white/35">
        This preview does not store personal information. Secure storage and
        access controls will be added before members use this feature.
      </p>
    </section>
  );
}
