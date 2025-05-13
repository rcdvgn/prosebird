import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./_contexts/AuthContext";
import { ModalProvider } from "./_contexts/ModalContext";
import Modal from "./_components/wrappers/Modal";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./_contexts/ThemeContext";

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
      <body className={`bg-background ${publicSans.className}`}>
        <ThemeProvider>
          <AuthProvider>
            <ModalProvider>
              <MotionConfig transition={{ ease: "easeInOut" }}>
                {children}
              </MotionConfig>
              <Modal />
            </ModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
