"use client";

import { useState } from "react";

const products = [
  {
    id: "payg",
    name: "Group session",
    price: "£8.00",
    description: "One Bootcamp or HYROX class",
    billing: "One-time payment",
  },
  {
    id: "monthly",
    name: "Monthly membership",
    price: "£60.00",
    description: "Unlimited group sessions and gym usage",
    billing: "Recurring monthly payment",
  },
  {
    id: "one-to-one",
    name: "Private 1:1",
    price: "£35.00",
    description: "One private 60-minute training session",
    billing: "One-time payment",
  },
  {
    id: "ten-pack",
    name: "Ten 1:1 sessions",
    price: "£250.00",
    description: "Ten private sessions, valid for three months",
    billing: "One-time payment",
  },
] as const;

type Product = (typeof products)[number];

export default function OnlinePayments() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [message, setMessage] = useState("");

  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-pink">
            Pay securely online
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
            Memberships &amp; sessions
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Choose what you would like to purchase. The finished checkout will
            be handled securely by a regulated payment provider.
          </p>
        </div>
        <span className="w-fit rounded-full border border-pink/35 bg-pink/10 px-4 py-2 text-xs font-black text-pink">
          CHECKOUT PREVIEW
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className={`flex min-h-64 flex-col rounded-2xl border p-5 transition ${
              selected?.id === product.id
                ? "border-pink bg-pink/10"
                : "border-white/10 bg-black/25"
            }`}
          >
            <p className="text-xs font-black uppercase tracking-widest text-pink">
              {product.billing}
            </p>
            <h3 className="mt-4 text-xl font-black">{product.name}</h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-white/50">
              {product.description}
            </p>
            <p className="mt-5 text-3xl font-black tracking-tight">{product.price}</p>
            <button
              type="button"
              onClick={() => {
                setSelected(product);
                setMessage("");
              }}
              className="mt-5 w-full rounded-full bg-pink px-5 py-3 text-sm font-black transition hover:bg-[#ff3b91]"
            >
              Choose
            </button>
          </article>
        ))}
      </div>

      {selected && (
        <div className="mt-6 rounded-2xl border border-pink/35 bg-pink/10 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-pink">
                Order summary
              </p>
              <p className="mt-2 text-xl font-black">{selected.name}</p>
              <p className="mt-1 text-sm text-white/50">
                {selected.billing} · {selected.price}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setMessage(
                  "Checkout is ready for connection. No payment or card details have been taken in this preview.",
                )
              }
              className="rounded-full bg-white px-6 py-3 font-black text-black transition hover:bg-white/85"
            >
              Continue to secure checkout
            </button>
          </div>
          {message && (
            <p role="status" className="mt-5 border-t border-white/10 pt-5 text-sm font-bold text-pink">
              {message}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-3 text-xs leading-5 text-white/35 sm:grid-cols-3">
        <p>Card information will be entered only on the payment provider&apos;s secure checkout.</p>
        <p>Monthly membership will clearly state that it is a recurring payment before purchase.</p>
        <p>Successful payments will appear automatically in the member&apos;s payment history.</p>
      </div>
    </section>
  );
}
