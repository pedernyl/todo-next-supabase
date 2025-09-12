"use client";
import AuthButtons from "../../components/AuthButtons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Sign in</h1>
        <p className="mb-4 text-gray-600">
          Please sign in to view your todos.
        </p>
        <AuthButtons />
      </div>
    </div>
  );
}
