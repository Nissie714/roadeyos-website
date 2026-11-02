"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/customer-login");
    router.refresh();
  }

  return (
    <button onClick={signOut} className="rounded-full border border-white/20 px-4 py-2 text-sm font-black transition hover:border-pink hover:text-pink">
      Sign out
    </button>
  );
}
