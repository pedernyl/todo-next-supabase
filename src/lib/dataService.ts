import { supabase } from './supabaseClient';
import { Todo } from '../../types';

// Fetch all todos from Supabase
export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data as Todo[];
}

// Create a new todo in Supabase
export async function createTodo(title: string, description: string): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .insert([{ title, description, owned_by: 1,completed: false }])
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

// Delete a todo from Supabase
export async function deleteTodo(id: string): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .select('id')
    .single();

  if (error) throw error;
  return data as { id: string };
}