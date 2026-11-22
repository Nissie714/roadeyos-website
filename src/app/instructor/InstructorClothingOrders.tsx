"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type ClothingOrderItem = {
  garment: string;
  hoodie_style?: string | null;
  size: string;
  garment_colour: string;
  rear_logo: boolean;
  logo_colour: string | null;
};

export type ClothingOrderRecord = {
  id: string;
  athlete_name: string;
  items: ClothingOrderItem[];
  status: string;
  created_at: string;
};

export default function InstructorClothingOrders({ previewOrders }: { previewOrders?: ClothingOrderRecord[] }) {
  const [orders, setOrders] = useState<ClothingOrderRecord[]>(previewOrders ?? []);
  const [message, setMessage] = useState(previewOrders ? "" : "Loading clothing orders…");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const rows = useMemo(() => orders.flatMap((order) => order.items.map((item, index) => ({ order, item, index }))), [orders]);
  const filteredRows = useMemo(() => rows.filter(({ order, item }) =>
    `${order.athlete_name} ${item.garment} ${item.hoodie_style ?? ""} ${item.size} ${item.garment_colour} ${order.status}`.toLowerCase().includes(search.trim().toLowerCase()),
  ), [rows, search]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const loadOrders = useCallback(async () => {
    if (previewOrders) return;
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_instructor_clothing_orders");
    if (error) setMessage(error.message);
    else {
      setOrders((data ?? []) as ClothingOrderRecord[]);
      setMessage("");
    }
  }, [previewOrders]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadOrders(), 0);
    return () => window.clearTimeout(timer);
  }, [loadOrders]);

  return (
    <section className="mt-10 rounded-[2rem] border border-pink/25 bg-[#101010] p-5 sm:p-7">
      <p className="eyebrow">Athlete requests</p>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-[-.03em]">Clothing orders</h2>
      <p className="mt-3 text-sm leading-6 text-white/55">Scan orders by athlete and clothing item. Search or move between pages as orders grow.</p>

      {message ? <p role="status" className="mt-6 text-sm text-white/50">{message}</p> : orders.length ? (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <label className="block w-full max-w-sm">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-white/55">Find an order</span>
              <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Athlete, garment, size or colour" className="progress-input" />
            </label>
            <p className="text-sm text-white/50">{filteredRows.length} clothing {filteredRows.length === 1 ? "item" : "items"} · {orders.length} {orders.length === 1 ? "order" : "orders"}</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
              <thead className="bg-white/[.06] text-xs font-black uppercase tracking-wide text-white/55">
                <tr><th className="px-4 py-3">Athlete</th><th className="px-4 py-3">Ordered</th><th className="px-4 py-3">Item</th><th className="px-4 py-3">Style</th><th className="px-4 py-3">Size</th><th className="px-4 py-3">Colour</th><th className="px-4 py-3">Rear logo</th><th className="px-4 py-3">Logo colour</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {visibleRows.map(({ order, item, index }) => (
                  <tr key={`${order.id}-${index}`} className="hover:bg-white/[.04]">
                    <td className="px-4 py-3 font-bold">{order.athlete_name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-white/60">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" }).format(new Date(order.created_at))}</td>
                    <td className="px-4 py-3 font-bold">{item.garment}</td>
                    <td className="px-4 py-3">{item.hoodie_style ?? "—"}</td>
                    <td className="px-4 py-3">{item.size}</td>
                    <td className="px-4 py-3">{item.garment_colour}</td>
                    <td className="px-4 py-3">{item.rear_logo ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">{item.rear_logo ? item.logo_colour : "—"}</td>
                    <td className="px-4 py-3 text-pink">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visibleRows.length && <p className="p-5 text-sm text-white/50">No clothing orders match your search.</p>}
          </div>
          {pageCount > 1 && <div className="mt-4 flex items-center justify-end gap-3 text-sm">
            <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="rounded-full border border-white/15 px-4 py-2 disabled:opacity-35">Previous</button>
            <span className="text-white/55">Page {currentPage} of {pageCount}</span>
            <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} className="rounded-full border border-white/15 px-4 py-2 disabled:opacity-35">Next</button>
          </div>}
        </div>
      ) : <p className="mt-6 text-sm text-white/50">No clothing orders have been submitted yet.</p>}
    </section>
  );
}
