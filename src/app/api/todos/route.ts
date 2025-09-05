// Handle fetching todos with optional completed filter
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const showCompleted = url.searchParams.get('showCompleted');
  // Default to true if not provided
  const showCompletedBool = showCompleted === null ? true : showCompleted === 'true';
  // Import getTodos dynamically to avoid circular imports
  const { getTodos } = await import('../../../lib/dataService');
  const todos = await getTodos(showCompletedBool);
  return NextResponse.json(todos);
}
import { NextRequest, NextResponse } from 'next/server';
import { createTodo, updateTodo, deleteTodo } from '../../../lib/dataService';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

// Handle creating a Todo
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, description } = await req.json();

  const todo = await createTodo(title, description);

  return NextResponse.json(todo);
}

// Handle updating a Todo (toggle completed)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, completed } = await req.json();

  const todo = await updateTodo(id, completed);

  return NextResponse.json(todo);
}

// Handle deleting a Todo
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const deleted = await deleteTodo(id);
  return NextResponse.json(deleted);
}