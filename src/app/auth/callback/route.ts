import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/member`);
    }
  }

  return NextResponse.redirect(
    `${origin}/customer-login?message=${encodeURIComponent("We could not confirm that sign-in link. Please try again.")}`,
  );
}
