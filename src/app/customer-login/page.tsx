import Image from "next/image";
import Link from "next/link";

const currentBookingUrl = "https://roadeyos.co.uk/m/account";

export const metadata = {
  title: "Customer Login Preview | Road-e-yo's",
  description: "Preview the new Road-e-yo's customer booking area.",
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
          <p className="eyebrow">New customer area</p>
          <h1 className="mt-5 max-w-3xl text-6xl font-black uppercase leading-[.88] tracking-[-.06em] sm:text-7xl">
            Your training.
            <br />
            <span className="text-pink">All in one place.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-white/65">
            The new Road-e-yo&apos;s member area will let you book sessions,
            see your calendar, manage cancellations and check your membership.
          </p>
          <ul className="mt-9 grid gap-4 text-sm font-bold text-white/75 sm:grid-cols-2">
            <li className="login-benefit">Live class availability</li>
            <li className="login-benefit">Upcoming booking calendar</li>
            <li className="login-benefit">Email confirmations</li>
            <li className="login-benefit">Secure online payments</li>
          </ul>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#111] p-6 shadow-2xl sm:p-9">
          <div className="rounded-2xl border border-pink/30 bg-pink/10 p-4">
            <p className="text-sm font-black text-pink">PREVIEW MODE</p>
            <p className="mt-1 text-sm leading-6 text-white/65">
              This new login is being built and is not accepting member details yet.
            </p>
          </div>

          <h2 className="mt-8 text-3xl font-black uppercase tracking-tight">Customer login</h2>
          <div className="mt-7 space-y-5" aria-label="Preview of future customer login">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/70">Email address</span>
              <input
                disabled
                type="email"
                placeholder="you@example.com"
                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[.04] px-4 py-4 text-white/40"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/70">Password</span>
              <input
                disabled
                type="password"
                placeholder="••••••••"
                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[.04] px-4 py-4 text-white/40"
              />
            </label>
            <button
              disabled
              className="w-full cursor-not-allowed rounded-full bg-pink/45 px-6 py-4 font-black text-white/65"
            >
              Secure login coming soon
            </button>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href="/member"
              className="rounded-full border border-pink px-5 py-3 text-center text-sm font-black text-pink transition hover:bg-pink hover:text-white"
            >
              View member preview
            </Link>
            <a
              href={currentBookingUrl}
              className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-black transition hover:border-white/50"
            >
              Use current login
            </a>
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-white/35">
            Continue using the current login for all real bookings until we announce the switch.
          </p>
        </div>
      </section>
    </main>
  );
}
