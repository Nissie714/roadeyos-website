"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InstructorSignOut() {
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.push("/instructor-login");
    router.refresh();
  }
  return <button onClick={signOut} className="rounded-full border border-white/20 px-4 py-2 text-sm font-black hover:border-pink hover:text-pink">Sign out</button>;
}
