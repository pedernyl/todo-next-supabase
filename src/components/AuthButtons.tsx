'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
  <div className="flex items-center justify-between max-w-xl mx-auto">
        <span className="text-gray-700">Welcome, {session.user?.name}</span>
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
  <div className="flex justify-center max-w-xl mx-auto">
      <button
        onClick={() => signIn()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Sign in
      </button>
    </div>
  );
}
