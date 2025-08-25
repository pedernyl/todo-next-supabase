"use client";

import React from "react";
import { Todo } from "../../types";
import AddTodo from "./AddTodo";

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = React.useState(initialTodos);
  // State to keep track of which descriptions are open
  const [openDescriptions, setOpenDescriptions] = React.useState<{ [id: string]: boolean }>({});

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch("/api/todos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, completed }),
      });

        throw new Error(`Failed to update todo: ${response.status} ${response.statusText}`);
      }

      const updatedTodo = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updatedTodo : t))
      );
    } catch (error) {
      console.error("Failed to update todo via API route:", error);
    }
  };

  // Toggle function for description
  const toggleDescription = (id: string) => {
    setOpenDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
            className="flex flex-col gap-2 p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className={todo.completed ? "line-through text-gray-400" : ""}>
                {todo.title}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleDescription(todo.id)}
                  className="px-2 py-1 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm"
                >
                  {openDescriptions[todo.id] ? "Dölj beskrivning" : "Visa beskrivning"}
                </button>
                <button
                  onClick={() => toggleTodo(todo.id, !todo.completed)}
                  className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  {todo.completed ? "Undo" : "Complete"}
                </button>
              </div>
            </div>
            {openDescriptions[todo.id] && todo.description && (
              <div className="mt-2 text-gray-700 text-sm border-l-4 border-blue-200 pl-4">
                {todo.description}
              </div>
            )}
          </li>
        ))}
    </ul>
  </div>
);
}