"use client";

import React from "react"; 
import { Todo } from "../../types";
import AddTodo from "./AddTodo";

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = React.useState(initialTodos);

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string, completed: boolean) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );
  };

  return (
  <div className="space-y-4">
    {/* AddTodo form */}
    <AddTodo onTodoAdded={handleTodoAdded} />

    {/* Todo list */}
    <ul className="space-y-2">
      {todos
        .slice()
        .sort((a, b) => Number(a.completed) - Number(b.completed))
        .map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <span className={todo.completed ? "line-through text-gray-400" : ""}>
              {todo.title}
            </span>
            <button
              onClick={() => toggleTodo(todo.id, !todo.completed)}
              className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {todo.completed ? "Undo" : "Complete"}
            </button>
          </li>
        ))}
    </ul>
  </div>
);
}
