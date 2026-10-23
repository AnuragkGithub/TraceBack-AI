import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TraceBack AI — Understand Your Errors",
  description: "An open-source AI debugging mentor that helps learners understand Python errors.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
