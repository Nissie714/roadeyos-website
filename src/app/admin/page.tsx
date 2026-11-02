import Image from "next/image";
import Link from "next/link";
import CashPaymentDashboard from "./CashPaymentDashboard";

export const metadata = {
  title: "Admin Dashboard Preview | Road-e-yo's",
  description: "Preview the Road-e-yo's owner dashboard for recording cash payments.",
};

export default function AdminPreviewPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="section-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Road-e-yo's home">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white">
              <Image
                src="/images/roadeyos-logo.jpg"
                alt=""
                width={80}
                height={80}
                className="h-full w-full object-contain object-center"
              />
            </span>
            <span className="text-lg font-black">
              Road-e-yo&apos;s<span className="text-pink">.</span>
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-black"
          >
            Exit admin preview
          </Link>
        </div>
      </header>
      <CashPaymentDashboard />
    </main>
  );
}
