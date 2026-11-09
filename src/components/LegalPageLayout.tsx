import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
};

export default function LegalPageLayout({ eyebrow, title, updated, children }: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="section-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Road-e-yo's home">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white">
              <Image src="/images/roadeyos-logo.jpg" alt="" width={80} height={80} className="h-full w-full object-contain object-center" />
            </span>
            <span className="text-lg font-black">Road-e-yo&apos;s<span className="text-pink">.</span></span>
          </Link>
          <Link href="/" className="rounded-full border border-white/20 px-4 py-2 text-sm font-black transition hover:border-pink hover:text-pink">Back home</Link>
        </div>
      </header>

      <article className="section-shell py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-[-.04em] sm:text-6xl">{title}</h1>
          <p className="mt-4 text-sm text-white/40">Last updated: {updated}</p>
          <div className="mt-10 space-y-8 text-[.95rem] leading-7 text-white/70 [&_a]:text-pink [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-tight [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-2">
            {children}
          </div>
        </div>
      </article>

      <footer className="border-t border-white/10 bg-black py-8">
        <div className="section-shell flex flex-col gap-3 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Road-e-yo&apos;s Bootcamp &amp; Fitness Centre.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-pink">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-pink">Terms &amp; Conditions</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
