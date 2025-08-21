import { client } from '../lib/hygraph';
import { gql } from 'graphql-request';
import TodoList from '../components/TodoList';
import AuthButtons from '../components/AuthButtons';
import { Todo } from '../../types';
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";

const GET_TODOS = gql`
  query {
    todos(stage: PUBLISHED) {
      id
      title
      description
      completed
    }
  }
`;

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If no user is logged in → redirect
  if (!session) {
    redirect("/login");
  }
  
  const data = await client.request<{ todos: Todo[] }>(GET_TODOS);
  const todos = data.todos;

  return (
    <div className="min-h-screen bg-gray-100 p-10 font-sans">
      <h1 className="text-center text-3xl font-bold mb-8">Todo App</h1>
      <AuthButtons />
      <TodoList initialTodos={todos} />
    </div>
  );
}
