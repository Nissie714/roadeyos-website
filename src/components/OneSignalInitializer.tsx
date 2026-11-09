"use client";

import Script from "next/script";
import { useEffect } from "react";

const appId = "91df97a2-947c-4ebc-a026-3ebc04ecf8b1";

export default function OneSignalInitializer() {
  useEffect(() => {
    if (window.roadeyosOneSignalQueued) return;
    window.roadeyosOneSignalQueued = true;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.init({
        appId,
        notifyButton: { enable: false },
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerParam: { scope: "/" },
      });
      window.roadeyosOneSignal = OneSignal;
      window.dispatchEvent(new Event("roadeyos:onesignal-ready"));
    });
  }, []);

  return <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />;
}
