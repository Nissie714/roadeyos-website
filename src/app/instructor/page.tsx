import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InstructorRoster from "./InstructorRoster";
import InstructorSignOut from "./InstructorSignOut";
import ProfileNameForm from "@/components/ProfileNameForm";
import InstructorBroadcast from "./InstructorBroadcast";

export const metadata = { title: "Instructor Dashboard | Road-e-yo's" };

export default async function InstructorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/instructor-login");
  const { data: allowed } = await supabase.rpc("is_instructor");
  if (!allowed) redirect("/instructor-login");

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="section-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white"><Image src="/images/roadeyos-logo.jpg" alt="" width={80} height={80} className="h-full w-full object-contain" /></span><span className="text-lg font-black">Road-e-yo&apos;s<span className="text-pink">.</span></span></Link>
          <InstructorSignOut />
        </div>
      </header>
      <div className="section-shell py-12 sm:py-16">
        <p className="eyebrow">Private staff area</p>
        <h1 className="mt-3 text-5xl font-black uppercase tracking-[-.05em] sm:text-6xl">Class rosters.</h1>
        <p className="mt-4 text-white/55">Signed in as {user.email}</p>
        <ProfileNameForm />
        <InstructorBroadcast />
        <InstructorRoster />
      </div>
    </main>
  );
}
