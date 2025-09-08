'use client';

import { useState } from 'react';
import { Todo } from '../../types';

interface AddTodoProps {
  onTodoAdded?: (todo: Todo) => void;
}

export default function AddTodo({ onTodoAdded }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) return;
    const newTodo: Todo = await res.json();
    onTodoAdded?.(newTodo);
    setTitle('');
    setDescription('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-xl mx-auto mb-6"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        Add Todo
      </button>
    </form>
  );
}
