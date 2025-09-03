'use client';

import { useSession } from "next-auth/react";

/**
 * Custom hook to get the current user's ID from the session
 * Returns the user ID from Supabase if user is authenticated, null otherwise
 */
export function useUserId(): string | null {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (session as any)?.userId || null;
}

/**
 * Custom hook to get the current user's email from the session
 * Returns the user email if user is authenticated, null otherwise
 */
export function useUserEmail(): string | null {
  const { data: session } = useSession();
  return session?.user?.email || null;
}

/**
 * Custom hook to get both user ID and email
 * Returns an object with userId and email
 */
export function useUserInfo(): { userId: string | null; email: string | null } {
  const { data: session } = useSession();
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: (session as any)?.userId || null,
    email: session?.user?.email || null,
  };
}