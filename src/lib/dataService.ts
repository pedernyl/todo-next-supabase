import { supabase } from './supabaseClient';
import { Todo, User } from '../../types';

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
    .insert([{ title, description, completed: false }])
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

// User management functions

// Get user by email from Supabase
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    // If user not found, return null instead of throwing error
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  return data as User;
}

// Create a new user in Supabase
export async function createUser(email: string, name?: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert([{ 
      email, 
      name: name || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// Get user by email, create if doesn't exist
export async function getOrCreateUser(email: string, name?: string): Promise<User> {
  // First, try to get existing user
  const existingUser = await getUserByEmail(email);
  
  if (existingUser) {
    return existingUser;
  }

  // User doesn't exist, create new one
  return await createUser(email, name);
}

// Helper function to get current user ID from session
export async function getCurrentUserId(email: string): Promise<string | null> {
  try {
    const user = await getUserByEmail(email);
    return user?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}