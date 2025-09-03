// Type definition for a Todo item
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// Type definition for a User item
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}
