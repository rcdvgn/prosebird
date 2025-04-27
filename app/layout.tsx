import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./_contexts/PosthogContext";

const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProseBird - What would you like to say today?",
  description:
    "ProseBird is an interactive teleprompter designed for solo and collaborative online presentations. Apply today for early access!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-background overflow-hidden ${publicSans.className}`}>
        <PostHogProvider> {children}</PostHogProvider>
      </body>
    </html>
  );
}
