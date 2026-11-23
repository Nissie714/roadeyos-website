import Image from "next/image";
import Link from "next/link";
import AthleteDashboardTabs from "./AthleteDashboardTabs";
import SignOutButton from "./SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MembershipOverdueBanner from "./MembershipOverdueBanner";

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
            <span className="grid h-11 w-11 place-items-center rounded-full">
              <Image src="/images/roadeyos-logo-glow.png" alt="" width={80} height={80} className="h-full w-full object-contain object-center" />
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
            <div className="mt-5 max-w-2xl rounded-2xl border border-pink/35 bg-pink/[.09] px-5 py-4">
              <p className="text-sm font-black text-pink">Do you want to treat yourself to a new hoodie or T-shirt?</p>
              <p className="mt-1 text-sm leading-6 text-white/65">Clothing orders are now being taken—check the Clothing Order tab.</p>
            </div>
            <p className="mt-4 text-white/55">Signed in as {user.email}</p>
            <MembershipOverdueBanner />
          </div>
        </div>

        <AthleteDashboardTabs />
      </div>
    </main>
  );
}
