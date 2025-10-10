import { supabase } from './supabaseClient';

export interface Category {
  id: string;
  title: string;
  description?: string;
  owner_id: number;
}

// Fetch all categories for a user
export async function getCategories(owner_id: number): Promise<Category[]> {
  const { data, error } = await supabase
    .from('Category')
    .select('*')
    .eq('owner_id', owner_id)
    .order('title', { ascending: true });
  if (error) throw error;
  return data as Category[];
}

// Create a new category
export async function createCategory(title: string, owner_id: number, description?: string): Promise<Category> {
  const { data, error } = await supabase
    .from('Category')
    .insert([{ title, owner_id, description }])
    .select()
    .single();
  if (error) throw error;
  return data as Category;
}
