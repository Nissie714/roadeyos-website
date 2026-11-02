import Image from "next/image";
import Link from "next/link";
import ClassBookingManager from "./ClassBookingManager";
import SignOutButton from "./SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileNameForm from "@/components/ProfileNameForm";

export const metadata = {
  title: "Athlete Account | Road-e-yo's",
  description: "Your secure Road-e-yo's athlete account.",
};

export default async function MemberPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/customer-login");

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
          <SignOutButton />
        </div>
      </header>

      <div className="section-shell py-12 sm:py-16">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Customer dashboard</p>
            <h1 className="mt-3 text-5xl font-black uppercase tracking-[-.05em] sm:text-6xl">
              Hello, athlete.
            </h1>
            <p className="mt-4 text-white/55">Signed in as {user.email}</p>
          </div>
        </div>

        <ProfileNameForm />

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-6">
          <p className="text-xs font-black uppercase tracking-widest text-pink">Cancellation policy</p>
          <p className="mt-4 text-sm leading-6 text-white/55">
            Group bookings require 12 hours&apos; notice. Contact Road-e-yo&apos;s directly if you need help with a late cancellation.
          </p>
        </section>

        <ClassBookingManager />
      </div>
    </main>
  );
}
