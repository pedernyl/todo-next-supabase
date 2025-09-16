"use client";


import "./globals.css";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { UserIdProvider } from "../context/UserIdContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <UserIdProvider>{children}</UserIdProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
