"use client";

import React from "react";
import { Todo } from "../../types";
import AddTodo from "./AddTodo";

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {

  const [todos, setTodos] = React.useState(initialTodos);
  const [openDescriptions, setOpenDescriptions] = React.useState<{ [id: string]: boolean }>({});
  const [showCompleted, setShowCompleted] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editTodo, setEditTodo] = React.useState<Todo | null>(null);

  // Fetch todos from Supabase with filter
  const fetchTodos = async (showCompleted: boolean) => {
    try {
      const response = await fetch(`/api/todos?showCompleted=${showCompleted}`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle show/hide completed todos
  const handleToggleShowCompleted = () => {
    setShowCompleted((prev) => {
      const newValue = !prev;
      fetchTodos(newValue);
      return newValue;
    });
  };

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos((prev) => [newTodo, ...prev]);
    setEditTodo(null);
    setShowAddForm(false);
  };

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo);
    setShowAddForm(true);
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

      if (!response.ok) {
        throw new Error(`Failed to update todo: ${response.status} ${response.statusText}`);
      }

      const updatedTodo = await response.json();
      setTodos((prev) => {
        return prev.map((t) => (t.id === id ? updatedTodo : t));
      });
    } catch (error) {
      console.error("Failed to update todo via API route:", error);
    }
  };

  const toggleDescription = (id: string) => {
    setOpenDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Toggle show/hide completed todos, placed above and right */}
      <div className="flex justify-end">
        <button
          onClick={handleToggleShowCompleted}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition text-sm"
        >
          {showCompleted ? "Hide completed" : "Show completed"}
        </button>
      </div>

      {/* Show/hide AddTodo form link */}
      <div>
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="text-blue-600 hover:underline text-sm mb-2"
        >
          {showAddForm ? "Hide Add Todo" : "Add Todo"}
        </button>
      </div>

      {/* AddTodo form (conditionally rendered) */}
      {showAddForm && (
        <AddTodo
          onTodoAdded={handleTodoAdded}
          editTodo={editTodo}
        />
      )}

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
                    {openDescriptions[todo.id] ? "Hide Description" : "Show Description"}
                  </button>
                  <button
                    onClick={() => toggleTodo(todo.id, !todo.completed)}
                    className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                </div>
              </div>
              {openDescriptions[todo.id] && (
                <div className="mt-2 text-gray-700 text-sm border-l-4 border-blue-200 pl-4">
                  {todo.description}
                  <div>
                    <button
                      className="text-blue-600 hover:underline text-xs ml-2"
                      onClick={() => handleEdit(todo)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
