import { supabase } from './supabaseClient';
import { Todo } from '../../types';
import { authOptions } from "../lib/authOptions";
import { getServerSession } from "next-auth";

// Update a todo's title and description in Supabase
export async function updateTodoDetails(id: string, title: string, description: string): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .update({ title, description })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Todo;
}

// Fetch all todos from Supabase
export async function getTodos(showCompleted: boolean = true): Promise<Todo[]> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("User not authenticated");
  // Fetch user id from /api/userid
  const userIdRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/userid?email=${encodeURIComponent(session.user?.email ?? "")}`,
    { cache: "no-store" }
  );
  if (!userIdRes.ok) throw new Error("Could not fetch user id");
  const { userId } = await userIdRes.json();

  let query = supabase
    .from('todos')
    .select('*')
    .eq('owner_id', userId)
    .is('deleted_timestamp', null)
    .order('id', { ascending: true });

  if (!showCompleted) {
    query = query.eq('completed', false);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Todo[];
}

// Create a new todo in Supabase
export async function createTodo(title: string, description: string, parent_todo?: string): Promise<Todo> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("User not authenticated");
  // Fetch user id from /api/userid
  const userIdRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/userid?email=${encodeURIComponent(session.user?.email ?? "")}`,
    { cache: "no-store" }
  );
  if (!userIdRes.ok) throw new Error("Could not fetch user id");
  const { userId } = await userIdRes.json();
  if (typeof userId !== 'number') throw new Error('userId must be a number');
  const insertObj: Partial<Todo> = { title, description, owner_id: userId, completed: false };
  if (parent_todo) insertObj.parent_todo = parent_todo;
  const { data, error } = await supabase
    .from('todos')
    .insert([insertObj])
    .select()
    .single();
  if (error) throw error;
  return data as Todo;
}

// Update a todo's completed state in Supabase
export async function updateTodo(id: string, completed: boolean): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Todo;
}

// Soft delete a todo: set deleted_timestamp and deleted_by (can be user id or email)
export async function softDeleteTodo(id: string, userId: string | number): Promise<Todo> {
  const deleted_timestamp = Math.floor(Date.now() / 1000);
  const { data, error } = await supabase
    .from('todos')
    .update({ deleted_timestamp, deleted_by: String(userId) })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Todo;
}