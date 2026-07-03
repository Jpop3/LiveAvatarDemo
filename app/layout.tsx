import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dr Brian Kaplan — AI Avatar (Cochlear)",
  description:
    "An AI version of Dr Brian Kaplan, made by Cochlear. Demonstration only.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
