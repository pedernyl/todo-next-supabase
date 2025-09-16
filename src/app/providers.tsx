"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { UserIdProvider } from "../context/UserIdContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserIdProvider>{children}</UserIdProvider>
    </SessionProvider>
  );
}
