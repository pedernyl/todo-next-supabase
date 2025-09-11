// Type definition for a Todo item
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  parent_todo?: string | null;
}
