'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useUserId } from "../hooks/useUser";

export default function AuthButtons() {
  const { data: session } = useSession();
  const userId = useUserId();

  if (session) {
    return (
      <div className="flex items-center justify-between max-w-xl mx-auto mb-6">
        <div className="text-gray-700">
          <div>Welcome, {session.user?.name}</div>
          {userId && (
            <div className="text-sm text-gray-500">User ID: {userId}</div>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center max-w-xl mx-auto mb-6">
      <button
        onClick={() => signIn()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Sign in
      </button>
    </div>
  );
}
