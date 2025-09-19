// Type definition for a Todo item
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  owner_id: number;
  parent_todo?: string | null;
  deleted_timestamp?: number | null;
  deleted_by?: number | null;
}
