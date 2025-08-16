'use client';

import { useState } from 'react';
import { Todo } from '../../types';
import AddTodo from './AddTodo';

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const toggleCompleted = async (todo: Todo) => {
    const res = await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
    });
    const updatedTodo: Todo = await res.json();
    setTodos(todos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto">
      <AddTodo onAdd={todo => setTodos([todo, ...todos])} />
      <ul className="space-y-3">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`flex justify-between items-center p-4 rounded ${
              todo.completed ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <div>
              <strong>{todo.title}</strong>: {todo.description}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleCompleted(todo)}
                className={`px-3 py-1 rounded text-white ${
                  todo.completed
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                } transition`}
              >
                {todo.completed ? 'Incomplete' : 'Complete'}
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
