import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rogo — clone",
  description:
    "Section-by-section 1:1 clone of rogo.ai. See docs/PROJECT.md for scope.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
