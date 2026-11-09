import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const appId = "91df97a2-947c-4ebc-a026-3ebc004ecf8b";
const websiteUrl = "https://roadeyos-website.netlify.app/member";

Deno.serve(async (request) => {
  try {
    const payload = await request.json();
    const notification = payload.record;
    if (!notification?.user_id || !notification?.title || !notification?.message) {
      return Response.json({ error: "Invalid notification payload" }, { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("subscription_id")
      .eq("user_id", notification.user_id)
      .eq("enabled", true);

    if (error) throw error;
    const subscriptionIds = (data ?? []).map((item) => item.subscription_id);
    if (!subscriptionIds.length) return Response.json({ sent: 0 });

    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${Deno.env.get("ONESIGNAL_REST_API_KEY")}`,
      },
      body: JSON.stringify({
        app_id: appId,
        include_subscription_ids: subscriptionIds,
        headings: { en: notification.title },
        contents: { en: notification.message },
        url: websiteUrl,
        web_icon: "https://roadeyos-website.netlify.app/icon-192.png",
      }),
    });

    const result = await response.json();
    if (!response.ok) return Response.json(result, { status: response.status });
    return Response.json({ sent: subscriptionIds.length, result });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
});
