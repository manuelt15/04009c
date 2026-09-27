"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { ToastProvider } from "./Toaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MotionConfig reducedMotion="user">
        <ToastProvider>{children}</ToastProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
