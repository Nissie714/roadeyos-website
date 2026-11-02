import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Road-e-yo's | Bootcamp & Fitness Centre",
  description:
    "Bootcamp, HYROX training and personal coaching at Road-e-yo's in Old Romney, Kent.",
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
