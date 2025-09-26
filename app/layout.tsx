import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Readiness Assessment",
  description: "Summit Leadership - Change Readiness Assessment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-neutral-dark antialiased">{children}</body>
    </html>
  );
}


