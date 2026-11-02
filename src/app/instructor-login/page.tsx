import Image from "next/image";
import Link from "next/link";
import InstructorLoginForm from "./InstructorLoginForm";

export const metadata = {
  title: "Instructor Login | Road-e-yo's",
  description: "Secure Road-e-yo's instructor access.",
};

export default function InstructorLoginPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="section-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white">
              <Image src="/images/roadeyos-logo.jpg" alt="" width={80} height={80} className="h-full w-full object-contain" />
            </span>
            <span className="text-lg font-black">Road-e-yo&apos;s<span className="text-pink">.</span></span>
          </Link>
          <Link href="/" className="text-sm font-black text-white/60 hover:text-pink">Back to website</Link>
        </div>
      </header>
      <section className="section-shell grid min-h-[calc(100vh-77px)] place-items-center py-16">
        <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#111] p-6 shadow-2xl sm:p-9">
          <p className="eyebrow">Staff access</p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight">Instructor login</h1>
          <p className="mt-4 text-sm leading-6 text-white/55">View upcoming sessions and private athlete booking lists.</p>
          <InstructorLoginForm />
        </div>
      </section>
    </main>
  );
}
