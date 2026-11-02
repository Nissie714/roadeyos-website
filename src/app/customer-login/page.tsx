import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import AthleteLoginForm from "./AthleteLoginForm";

export const metadata = {
  title: "Athlete Login | Road-e-yo's",
  description: "Securely sign in to your Road-e-yo's athlete account.",
};

export default function CustomerLoginPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="section-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Back to Road-e-yo's homepage">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white">
              <Image
                src="/images/roadeyos-logo.jpg"
                alt=""
                width={80}
                height={80}
                className="h-full w-full object-contain object-center"
              />
            </span>
            <span className="text-lg font-black tracking-tight">
              Road-e-yo&apos;s<span className="text-pink">.</span>
            </span>
          </Link>
          <Link className="text-sm font-black text-white/60 transition hover:text-pink" href="/">
            Back to website
          </Link>
        </div>
      </header>

      <section className="section-shell grid min-h-[calc(100vh-77px)] items-center gap-14 py-16 lg:grid-cols-[1fr_.9fr]">
        <div>
          <p className="eyebrow">Athlete area</p>
          <h1 className="mt-5 max-w-3xl text-6xl font-black uppercase leading-[.88] tracking-[-.06em] sm:text-7xl">
            Your training.
            <br />
            <span className="text-pink">All in one place.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-white/65">
            Sign in to your secure Road-e-yo&apos;s account to view your training,
            membership and upcoming bookings as these services become available.
          </p>
          <ul className="mt-9 grid gap-4 text-sm font-bold text-white/75 sm:grid-cols-2">
            <li className="login-benefit">Live class availability</li>
            <li className="login-benefit">Upcoming booking calendar</li>
            <li className="login-benefit">Email confirmations</li>
            <li className="login-benefit">Secure online payments</li>
          </ul>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#111] p-6 shadow-2xl sm:p-9">
          <Suspense fallback={<p className="text-white/60">Loading secure login…</p>}>
            <AthleteLoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
