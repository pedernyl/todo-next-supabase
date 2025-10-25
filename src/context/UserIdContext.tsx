"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface UserIdContextType {
  userId: number | null;
}

const UserIdContext = createContext<UserIdContextType>({ userId: null });

export function useUserId() {
  return useContext(UserIdContext);
}

export function UserIdProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUserId() {
      if (session?.user?.email) {
        const res = await fetch("/api/userid?email=" + encodeURIComponent(session.user.email));
        if (res.ok) {
          const data = await res.json();
          setUserId(data.userId ?? null);
        }
      }
    }
    fetchUserId();
  }, [session?.user?.email]);

  return (
    <UserIdContext.Provider value={{ userId }}>
      {children}
    </UserIdContext.Provider>
  );
}
