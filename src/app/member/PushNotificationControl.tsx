"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function getOneSignal(): Promise<RoadeyosOneSignalSdk> {
  if (window.roadeyosOneSignal) return Promise.resolve(window.roadeyosOneSignal);

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      window.removeEventListener("roadeyos:onesignal-ready", handleReady);
      reject(new Error("OneSignal did not finish loading"));
    }, 10000);

    function handleReady() {
      if (!window.roadeyosOneSignal) return;
      window.clearTimeout(timeout);
      window.removeEventListener("roadeyos:onesignal-ready", handleReady);
      resolve(window.roadeyosOneSignal);
    }

    window.addEventListener("roadeyos:onesignal-ready", handleReady);
  });
}

export default function PushNotificationControl() {
  const [supported, setSupported] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      queueMicrotask(() => setSupported(false));
      return;
    }

    void getOneSignal().then((OneSignal) => {
      const refresh = () => setEnabled(Boolean(OneSignal.Notifications.permission && OneSignal.User.PushSubscription.optedIn));
      refresh();
      OneSignal.User.PushSubscription.addEventListener("change", refresh);
    }).catch(() => setMessage("Phone notifications are temporarily unavailable. Please refresh the page and try again."));
  }, []);

  async function waitForSubscriptionId(oneSignal: RoadeyosOneSignalSdk) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const subscriptionId = oneSignal.User.PushSubscription.id;
      if (subscriptionId) return subscriptionId;
      await new Promise((resolve) => window.setTimeout(resolve, 500));
    }
    throw new Error("OneSignal did not create a device subscription");
  }

  async function registerSubscription(subscriptionId: string) {
    const supabase = createClient();
    const { error } = await supabase.rpc("register_push_subscription", { p_subscription_id: subscriptionId });
    if (error) throw error;
  }

  async function enableNotifications() {
    setBusy(true);
    setMessage("");
    let stage = "loading OneSignal";
    try {
        const OneSignal = await getOneSignal();
        stage = "requesting browser permission";
        await OneSignal.Notifications.requestPermission();
        if (!OneSignal.Notifications.permission) {
          setMessage("Notifications were not allowed. You can change this in your phone or browser settings.");
          return;
        }
        stage = "creating the phone subscription";
        if (!OneSignal.User.PushSubscription.optedIn) {
          await OneSignal.User.PushSubscription.optIn();
        }
        const subscriptionId = await waitForSubscriptionId(OneSignal);
        stage = "saving the subscription";
        await registerSubscription(subscriptionId);
        setEnabled(true);
        setMessage("Phone notifications are enabled for class changes.");
      } catch (error) {
        const detail = error instanceof Error ? error.message : "unknown error";
        console.error(`Push notification setup failed while ${stage}`, error);
        setMessage(`Setup failed while ${stage}: ${detail.slice(0, 180)}`);
      } finally {
        setBusy(false);
      }
  }

  async function disableNotifications() {
    setBusy(true);
    setMessage("");
    try {
        const OneSignal = await getOneSignal();
        const subscriptionId = OneSignal.User.PushSubscription.id;
        await OneSignal.User.PushSubscription.optOut();
        if (subscriptionId) {
          const supabase = createClient();
          await supabase.rpc("disable_push_subscription", { p_subscription_id: subscriptionId });
        }
        setEnabled(false);
        setMessage("Phone notifications have been disabled on this device.");
      } catch {
        setMessage("We could not disable notifications. Please use your phone or browser notification settings.");
      } finally {
        setBusy(false);
      }
  }

  if (!supported) return <p className="mt-4 text-sm text-white/45">Push notifications are not supported by this browser.</p>;

  return (
    <div className="mt-5 rounded-2xl border border-pink/25 bg-pink/[.06] p-4">
      <p className="font-black">Phone notifications</p>
      <p className="mt-1 text-sm leading-6 text-white/55">Receive instant alerts when a booked class is moved or cancelled. Permission can be withdrawn at any time.</p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void (enabled ? disableNotifications() : enableNotifications())}
        className={`mt-4 rounded-full px-5 py-2.5 text-xs font-black transition disabled:opacity-50 ${enabled ? "border border-white/20 text-white/70 hover:border-pink" : "bg-pink text-white hover:bg-[#ff3b91]"}`}
      >
        {busy ? "Please wait…" : enabled ? "Disable phone notifications" : "Enable phone notifications"}
      </button>
      {message && <p role="status" className="mt-3 text-xs font-bold text-pink">{message}</p>}
      <p className="mt-3 text-xs leading-5 text-white/35">On iPhone, install Road-e-yo&apos;s on your Home Screen before enabling notifications.</p>
    </div>
  );
}
