


import { getTodos } from '../lib/dataService';
import AuthButtons from '../components/AuthButtons';
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import TodoPageClient from "./TodoPageClient";

export default async function Home() {
  const session = await getServerSession(authOptions);
  // Redirect if no user is logged in
  if (!session) {
    redirect("/login");
  }

  const todos = await getTodos();

  return (
    <div className="min-h-screen bg-gray-100 p-10 font-sans relative">
      {/* AuthButtons in upper left corner */}
      <div className="absolute left-10 top-2 z-10">
        <AuthButtons />
      </div>
      <h1 className="text-center text-3xl font-bold mb-8 mt-16">Todo App</h1>
      <TodoPageClient initialTodos={todos} />
    </div>
  );
}