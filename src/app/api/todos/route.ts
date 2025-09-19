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
import { createTodo, updateTodo } from '../../../lib/dataService';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

// Handle creating a Todo
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, description, parent_todo } = await req.json();

  const todo = await createTodo(title, description, parent_todo);

  return NextResponse.json(todo);
}

// Handle updating a Todo (toggle completed)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, completed, title, description } = body;

  let todo;
  if (typeof completed !== 'undefined' && typeof title === 'undefined' && typeof description === 'undefined') {
    // Only completed status is being updated
    todo = await updateTodo(id, completed);
  } else if (typeof title !== 'undefined' || typeof description !== 'undefined') {
    // Title/description update
    const { updateTodoDetails } = await import('../../../lib/dataService');
    todo = await updateTodoDetails(id, title, description);
  } else {
    return NextResponse.json({ error: "Invalid PATCH payload" }, { status: 400 });
  }

  return NextResponse.json(todo);
}

// Handle soft deleting a Todo
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, deleted_by } = await req.json();
  // Always require deleted_by to be a user id (number)
  const userId = deleted_by;
  if (!userId || typeof userId !== 'number') {
    return NextResponse.json({ error: "User id (number) required for deleted_by" }, { status: 400 });
  }
  const { softDeleteTodo } = await import('../../../lib/dataService');
  const deleted = await softDeleteTodo(id, userId);
  return NextResponse.json(deleted);
}