import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee Giving — Buddy4Study",
  description: "Support scholarship programmes for first-generation students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
