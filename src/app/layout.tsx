import type { Metadata } from "next";
import "./globals.css";
import { ViewTransitionProvider } from "@/components/ui/ViewTransitions";

/* Browser tab title. Deliberately "clix", not the target's own — this is the one place the
   build identifies as itself rather than as the clone target, and a tab reading "Rogo"
   would misrepresent whose site it is. An intentional divergence from 1:1, not a defect;
   do not "correct" it to match the capture. */
export const metadata: Metadata = {
  title: "clix",
  description:
    "Clix is the trusted AI partner to the world’s leading financial institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ViewTransitionProvider>{children}</ViewTransitionProvider>
      </body>
    </html>
  );
}
