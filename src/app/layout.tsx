import type { Metadata, Viewport } from "next";
import "./globals.css";
import OneSignalInitializer from "@/components/OneSignalInitializer";

export const metadata: Metadata = {
  title: "Road-e-yo's | Bootcamp & Fitness Centre",
  description:
    "Bootcamp, HYROX training and personal coaching at Road-e-yo's in Old Romney, Kent.",
  applicationName: "Road-e-yo's",
  manifest: "/site.webmanifest?v=2",
  appleWebApp: {
    capable: true,
    title: "Road-e-yo's",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-180.png?v=2", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ff2e88",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <OneSignalInitializer />
        {children}
        <div className="border-t border-white/10 bg-black px-5 py-5 text-center text-xs text-white/40">
          © 2026 Road-e-yo&apos;s. All rights reserved.
        </div>
      </body>
    </html>
  );
}
