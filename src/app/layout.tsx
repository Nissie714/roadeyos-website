import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Road-e-yos | Bootcamp & Fitness Centre",
  description:
    "HYROX-inspired training and energetic bootcamp classes at Road-e-yos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
