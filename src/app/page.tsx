import { getTodos } from '../lib/dataService';
import TodoList from '../components/TodoList';
import AuthButtons from '../components/AuthButtons';
import { Todo } from '../../types';
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect if no user is logged in
  if (!session) {
    redirect("/login");
  }

  const todos = await getTodos();

  return (
    <div className="min-h-screen bg-gray-100 p-10 font-sans">
      <h1 className="text-center text-3xl font-bold mb-8">Todo App</h1>
      <AuthButtons />
      <TodoList initialTodos={todos} />
    </div>
  );
}